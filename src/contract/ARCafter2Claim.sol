// SPDX-License-Identifier: MIT 

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ARC is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeMath for uint8;

    uint256 immutable public minInvestAmount = 0.1 ether;    // Minimum investment amount : 0.1 AVAX
	uint256 immutable public projectFee =            100;    // Project fee : 10%
	uint256 immutable public withdrawContractFee =    80;    // Withdraw contract fee : 8% 
    uint256 immutable public withdrawPoolFee =        20;    // Withdraw pool fee : 2%
	uint256 immutable public percentDivider =       1000;    // Divider for percents
    uint256 immutable public timeStep =           1 days;
	uint256 immutable public devFee =                 30;     // Dev Fee 3%
    uint256[] public REFERRAL_PERCENTS =    [50, 30, 20];     // 5%, 3%, 2%
	
	uint256 public totalStaked;
	uint256 public totalRefBonus;
	uint256 public totalPirates;

    address payable public  poolAddress;    
    address public          tokenAddress;
    uint256 public          startUNIX;
	address payable private commissionWallet;
	address payable private devWallet;
    address public          owner;

    struct Crew {
        uint256 time;
        uint256 percent;
    }

    Crew[] internal crewMembers;

	struct Deposit {
        uint8 crewMember;
		uint256 percent;
		uint256 amount;
		uint256 profit;
		uint256 start;
		uint256 finish;
	}

	struct User {
		Deposit[] deposits;
		uint256 checkpoint;
		address referrer;
		uint256[3] levels;
		uint256 bonus;
		uint256 totalBonus;
	}

	mapping (address => User) internal users;

	event Newbie(address user);
	event NewDeposit(address indexed user, uint8 crewMember, uint256 percent, uint256 amount, uint256 profit, uint256 start, uint256 finish);
	event Withdrawn(address indexed user, uint256 amount);
	event RefBonus(address indexed referrer, address indexed referral, uint256 indexed level, uint256 amount);
	event FeePayed(address indexed user, uint256 totalAmount);

	constructor(address payable wallet, address payable dWallet, address payable pool) public {
		require(!isContract(wallet));
		devWallet = dWallet;
		commissionWallet = wallet;
        poolAddress = pool;
        startUNIX = block.timestamp.add(10 days);
        owner = msg.sender;

        crewMembers.push(Crew(7, 200)); // 20%
        crewMembers.push(Crew(11, 185)); // 18.5%
        crewMembers.push(Crew(15, 170)); // 17%
        crewMembers.push(Crew(19, 155)); // 15.5%
        crewMembers.push(Crew(23, 140)); // 14%
        crewMembers.push(Crew(27, 125)); // 12.5%
	}

	function startQuest() public {
        require(msg.sender == commissionWallet);
		startUNIX = block.timestamp;
    } 

    mapping (address => uint256) _sumCrewMemberDeposits;

	function recruitPirate(address referrer, uint8 crewMember) public payable nonReentrant {
		require(block.timestamp > startUNIX, "The quest hasn't started yet.");
		require(msg.value >= minInvestAmount, "Minimum investment is 0.1.");
        require(crewMember < 6, "Invalid crew member.");

		uint256 fee = msg.value.mul(projectFee).div(percentDivider);
		uint256 devFees = msg.value.mul(devFee).div(percentDivider);
		commissionWallet.transfer(fee);
		devWallet.transfer(devFees);
		emit FeePayed(msg.sender, fee);

		User storage user = users[msg.sender];

		if (user.referrer == address(0)) {
			if (users[referrer].deposits.length > 0 && referrer != msg.sender) {
				user.referrer = referrer;
			}

			address upline = user.referrer;
			for (uint256 i = 0; i < 3; i++) {
				if (upline != address(0)) {
					users[upline].levels[i] = users[upline].levels[i].add(1);
					upline = users[upline].referrer;
				} else break;
			}
		}

		if (user.referrer != address(0)) {
			uint256 _refBonus = 0;
			address upline = user.referrer;
			for (uint256 i = 0; i < 3; i++) {
			if (upline != address(0)) {
				uint256 amount = msg.value.mul(REFERRAL_PERCENTS[i]).div(percentDivider);
							
				users[upline].bonus = users[upline].bonus.add(amount);
				users[upline].totalBonus = users[upline].totalBonus.add(amount);

				_refBonus = _refBonus.add(amount);
						
				emit RefBonus(upline, msg.sender, i, amount);
				upline = users[upline].referrer;
				} else break;
			}

			totalRefBonus = totalRefBonus.add(_refBonus);

		}

		if (user.deposits.length == 0) {
			user.checkpoint = block.timestamp;
			emit Newbie(msg.sender);
		}

		(uint256 percent, uint256 profit, uint256 finish) = getResult(crewMember, msg.value);
		user.deposits.push(Deposit(crewMember, percent, msg.value, profit, block.timestamp, finish));

		totalStaked = totalStaked.add(msg.value);
		totalPirates = totalPirates.add(1);

        _sumCrewMemberDeposits[msg.sender] += crewMember;
		
		emit NewDeposit(msg.sender, crewMember, percent, msg.value, profit, block.timestamp, finish);
	}

	function claimLoot() public nonReentrant {
		User storage user = users[msg.sender];
		address _addr = msg.sender;

		uint256 totalAmount = getUserDividends(msg.sender);
		uint256 contractfees = totalAmount.mul(withdrawContractFee).div(1000);
        uint256 poolfees = totalAmount.mul(withdrawPoolFee).div(1000);
        uint256 totalfees = contractfees + poolfees;
		totalAmount = totalAmount.sub(totalfees);

        payable(poolAddress).transfer(poolfees);

		uint256 referralBonus = getUserReferralBonus(msg.sender);
		if (referralBonus > 0) {
			user.bonus = 0;
			totalAmount = totalAmount.add(referralBonus);
		}

		require(totalAmount > 0, "Pirate has no dividends");

		uint256 contractBalance = address(this).balance;
		if (contractBalance < totalAmount) {
			totalAmount = contractBalance;
		}

		user.checkpoint = block.timestamp;
		
		payable(_addr).transfer(totalAmount);

		emit Withdrawn(msg.sender, totalAmount);

	}

	mapping (address => uint256) public lastClaimTimeARC;
	mapping (address => uint256) public stakedAmountARC;

	function claimARCLoot() public nonReentrant {
		require(msg.sender == tx.origin);
        require(calculARCEarnings(msg.sender) > 0,"You have no tokens to claim");
        uint256 earnedAmount = calculARCEarnings(msg.sender);
		lastClaimTimeARC[msg.sender] = block.timestamp;
        IERC20(tokenAddress).transfer(msg.sender, earnedAmount);
    }

	function calculARCEarnings(address _addr) public view returns(uint256) {
        uint256 earningsAmount = ((((((block.timestamp * 10**18) - (lastClaimTimeARC[_addr] * 10**18))/43200) * calculARCPercent(_addr)) * stakedAmountARC[_addr]) / 100) / 10**18;
        return earningsAmount;
	}

	function calculARCPercent(address _addr) public view returns(uint256) {
    	uint256 _averageCrewMember = _sumCrewMemberDeposits[_addr].div(getUserAmountOfDeposits(_addr));
		uint256 ARCPercent;
        if (_averageCrewMember < 1) {
            ARCPercent = 8; 
        }
        else if (_averageCrewMember >= 1 && _averageCrewMember < 2) {
            ARCPercent = 10; 
        }
        else if (_averageCrewMember >= 2 && _averageCrewMember < 3) {
            ARCPercent = 12; 
        }
        else if (_averageCrewMember >= 3 && _averageCrewMember < 4) {
            ARCPercent = 14; 
        } 
        else if (_averageCrewMember >= 4 && _averageCrewMember < 5) {
            ARCPercent = 16; 
        }
        else if (_averageCrewMember == 5) {
            ARCPercent = 18; 
        } 

        return ARCPercent;
	}

	function getContractBalance() public view returns (uint256) {
		return address(this).balance;
	}

	function getCrewMemberInfo(uint8 crewMember) public view returns(uint256 time, uint256 percent) {
		time = crewMembers[crewMember].time;
		percent = crewMembers[crewMember].percent;
	}

	function getPercent(uint8 crewMember) public view returns (uint256) {
		return crewMembers[crewMember].percent;
    }

	function getResult(uint8 crewMember, uint256 deposit) public view returns (uint256 percent, uint256 profit, uint256 finish) {
		percent = getPercent(crewMember);

		if (crewMember < 6) {
			profit = deposit.mul(percent).div(percentDivider).mul(crewMembers[crewMember].time);
		} 
		finish = block.timestamp.add(crewMembers[crewMember].time.mul(timeStep));
	}

	function getUserDividends(address userAddress) public view returns (uint256) {
		User storage user = users[userAddress];

		uint256 totalAmount;

		for (uint256 i = 0; i < user.deposits.length; i++) {
			if (user.checkpoint < user.deposits[i].finish) {
				if (user.deposits[i].crewMember < 6) {
					uint256 share = user.deposits[i].amount.mul(user.deposits[i].percent).div(percentDivider);
					uint256 from = user.deposits[i].start > user.checkpoint ? user.deposits[i].start : user.checkpoint;
					uint256 to = user.deposits[i].finish < block.timestamp ? user.deposits[i].finish : block.timestamp;
					if (from < to) {
						totalAmount = totalAmount.add(share.mul(to.sub(from)).div(timeStep));
					}
				} 
			}
		}

		return totalAmount;
	}

	function getContractInfo() public view returns(uint256, uint256, uint256) {
        return(totalStaked, totalRefBonus, totalPirates);
    }
    
	function getUserCheckpoint(address userAddress) public view returns(uint256) {
		return users[userAddress].checkpoint;
	}

	function getUserReferrer(address userAddress) public view returns(address) {
		return users[userAddress].referrer;
	}

	function getUserDownlineCount(address userAddress) public view returns(uint256, uint256, uint256) {
		return (users[userAddress].levels[0], users[userAddress].levels[1], users[userAddress].levels[2]);
	}

	function getUserReferralBonus(address userAddress) public view returns(uint256) {
		return users[userAddress].bonus;
	}

	function getUserReferralTotalBonus(address userAddress) public view returns(uint256) {
		return users[userAddress].totalBonus;
	}

	function getUserReferralWithdrawn(address userAddress) public view returns(uint256) {
		return users[userAddress].totalBonus.sub(users[userAddress].bonus);
	}

	function getUserAvailable(address userAddress) public view returns(uint256) {
		return getUserReferralBonus(userAddress).add(getUserDividends(userAddress));
	}

	function getUserAmountOfDeposits(address userAddress) public view returns(uint256) {
		return users[userAddress].deposits.length;
	}

	function getUserTotalDeposits(address userAddress) public view returns(uint256 amount) {
		for (uint256 i = 0; i < users[userAddress].deposits.length; i++) {
			amount = amount.add(users[userAddress].deposits[i].amount);
		}
	}

	function getUserDepositInfo(address userAddress, uint256 index) public view returns(uint8 crewMember, uint256 percent, uint256 amount, uint256 profit, uint256 start, uint256 finish) {
	    User storage user = users[userAddress];

		crewMember = user.deposits[index].crewMember;
		percent = user.deposits[index].percent;
		amount = user.deposits[index].amount;
		profit = user.deposits[index].profit;
		start = user.deposits[index].start;
		finish = user.deposits[index].finish;
	}

	function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }

    function changePoolAddress(address payable newPoolAddress) public {
        require(msg.sender == owner, "You're not the owner");
        poolAddress = newPoolAddress;
    }

    function changeTokenAddress(address newTokenAddress) public {
        require(msg.sender == owner, "You're not the owner");
        tokenAddress = newTokenAddress;
    }

	// TOKEN STAKING

    mapping (address => uint256) lastClaimTime;
    mapping (address => uint256) public stakedTokenAmount;
	mapping (address => uint256) public claimedTokenAmount;
    mapping (address => uint256) public stakingPercent;
	mapping (address => uint256) public stakingPercentLevel;

	uint256 public totalLockedAmount;
	uint256 public totalClaimedAmount;

    address public BURN = 0x000000000000000000000000000000000000dEaD;

	uint256 percentUpgradeBasePrice = 10000000000000000000;

    function stakeTokens(uint256 amount) public nonReentrant {
        require(msg.sender == tx.origin);
        require(amount > 0, "Amount must be greater than 0");
        require(IERC20(tokenAddress).balanceOf(msg.sender) >= amount, "Insufficient balance");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        stakedTokenAmount[msg.sender] += amount;
        lastClaimTime[msg.sender] = block.timestamp;
		totalLockedAmount += amount;
		if (stakingPercent[msg.sender] == 0 && stakingPercentLevel[msg.sender] == 0) {
		stakingPercent[msg.sender] = 8;
		++ stakingPercentLevel[msg.sender];
		}
    }

    function calculateEarnings(address _addr) public view returns(uint256) {
        uint256 earningsAmount = ((((((block.timestamp * 10**18) - (lastClaimTime[_addr] * 10**18))/43200) * stakingPercent[_addr]) * stakedTokenAmount[_addr]) / 100) / 10**18;
        return earningsAmount;
    }

    function compoundToken() public nonReentrant {
		require(msg.sender == tx.origin);
        require(calculateEarnings(msg.sender) > 0);
        require(stakingPercentLevel[msg.sender] >= 1);
        uint256 tokensToCompound = calculateEarnings(msg.sender);
        lastClaimTime[msg.sender] = block.timestamp;
        stakedTokenAmount[msg.sender] += tokensToCompound;
    }

    function upgradeStakingPercents() public nonReentrant {
		require(stakingPercentLevel[msg.sender] >= 1 && stakingPercentLevel[msg.sender] <= 8);
		require(IERC20(tokenAddress).balanceOf(msg.sender) >= percentUpgradeBasePrice, "Insufficient balance");
		uint256 upgradePercentCost = percentUpgradeBasePrice * stakingPercentLevel[msg.sender];
        IERC20(tokenAddress).transfer(BURN, upgradePercentCost);
        ++stakingPercent[msg.sender];
		++stakingPercentLevel[msg.sender];
    }

    function withdrawTokens() public nonReentrant {
		require(msg.sender == tx.origin);
        require(calculateEarnings(msg.sender) > 0);
        require(stakingPercentLevel[msg.sender] >= 1);
        uint256 earnedAmount = calculateEarnings(msg.sender);
		uint256 tokenToWithdraw = earnedAmount * 90/100;
		lastClaimTime[msg.sender] = block.timestamp;
		claimedTokenAmount[msg.sender] += tokenToWithdraw;
        IERC20(tokenAddress).transfer(msg.sender, tokenToWithdraw);
		totalClaimedAmount += tokenToWithdraw;
    }

	function getUpgradeStakingPercentPrice(address _addr) public view returns(uint256) {
		return percentUpgradeBasePrice * stakingPercentLevel[_addr];
	}

	function changeUpgradePercentBasePrice(uint256 _newBasePrice) public {
		require(msg.sender == owner, "You're not the owner.");
		percentUpgradeBasePrice = _newBasePrice;
	}

}
