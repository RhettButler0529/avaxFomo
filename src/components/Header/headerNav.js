import React, { useCallback, useState } from 'react';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import classes from './headerNav.module.css';
import WalletButton from './walletButton'
import { propTypes } from 'react-bootstrap/esm/Image';

import Modal from './modal.css';

const sections2 = [
  // { title: '$0.318', url: '#', icon: '/img/FSM.26a08c9ac39524cc989b.png'},
  // { title: '0.001 FTM', url: '#', icon: '/img/XFTM.df5dd5d99aa13e9a2819.png' },
  // { title: '$1.298', url: '#', icon: '/img/download.png' },
];

const HeaderNav = (props) => {
  const [state, setState] = useState("Dashboard")

  return (
    <>
      <div className={classes.headerTool}>
        <div className={classes.dflexRow}>
          <div className={classes.navbarLogo}>
            <img className={classes.navbarLogoImg} src='/img/logo.png' alt='' />
          </div>
          <Toolbar component="nav" variant="dense" className={classes.navSection}>
            <Link
              style={{ textDecoration: "none" }}
              noWrap
              href="/"
              className={classes.navToolbarLink}>Dashboard
            </Link>
            <Link
              style={{ textDecoration: "none" }}
              noWrap
              href="/token-stake"
              className={classes.navToolbarLink}>Token Stake
            </Link>
            <Link
              style={{ textDecoration: "none" }}
              noWrap
              href="#"
              className={classes.navToolbarLink}>Discord
            </Link>
            <Link
              style={{ textDecoration: "none" }}
              noWrap
              href="https://twitter.com/arctic_pirates"
              className={classes.navToolbarLink}>Twitter
            </Link>
            <Link
              style={{ textDecoration: "none" }}
              noWrap
              href="#"
              className={classes.navToolbarLink}>Contract
            </Link>

            <label for="toggle1" class="open">Security</label>
            <input type="checkbox" id="toggle1"></input>
            <div class="modal">
              <div class="contentmodal1">
                <label for="toggle1" class="close">&times;</label>
                <div class="titleimg">
                  <h1><img class="docsimg" src='/img/security.png' alt="" />Security</h1>
                </div>
                <div class="paragraph">
                  <br></br>
                  <div class="security-text">
                    <p class="roletitle"><img class="cross" src='/img/icons/locked_1f512.png' alt="" />Security : Safe contract, audited, without vulnerabilities.</p>
                    <p>The contract has been audited several times and does not contain any vulnerabilities or backdoors. The contract has no reentrancy vulnerabilities or underflow/overflow vulnerabilities. the contract uses the latest version of the solidity compiler. The owner has no advantage and can only launch the start of the contract. The owner cannot stop the contract, modify it, delete it. The owner cannot withdraw the funds on the contract or modify the fees, the rewards.</p>
                    <p>We use security libraries provided by OpenZeppelin: ReentrancyGuard and SafeMath to bring even more security to the contract.</p>
                    <p class="roletitle"><img class="cross" src='/img/icons/water-wave_1f30a.png' alt="" />What the owner CAN DO :</p>
                    <p>The contract has only 3 external functions: stake, claim and launch. Launch allows to define that the current timestamp of block is the launch date, it allows to launch the contract. This function does not stop the contract and can only be called once.</p>
                    <p class="roletitle"><img class="cross" src='/img/icons/snowflake_2744-fe0f.png' alt="" />What the owner CANNOT DO :</p>
                  </div>
                  <div class="cannot">
                    <p><img class="cross" src='/img/icons/cross-mark_274c.png' alt="" />CANNOT : The owner cannot withdraw the funds on the contract. </p>
                    <p><img class="cross" src='/img/icons/cross-mark_274c.png' alt="" />CANNOT : The owner cannot change the staking and withdraw fees.</p>
                    <p><img class="cross" src='/img/icons/cross-mark_274c.png' alt="" />CANNOT : The owner cannot modify the rewards and the total return.</p>
                    <p><img class="cross" src='/img/icons/cross-mark_274c.png' alt="" />CANNOT : The owner cannot stop/kill or modify the contract.</p>
                    <p><img class="cross" src='/img/icons/cross-mark_274c.png' alt="" />CANNOT : The owner cannot ban, blacklist, prevent users from investing or claiming.</p>
                  </div>
                </div>
              </div>
            </div>

            <label for="toggle" class="open">Documentation</label>
            <input type="checkbox" id="toggle"></input>
            <div class="modal">
              <div class="contentmodal">
                <label for="toggle" class="close">&times;</label>
                <div class="titleimg">
                  <h1><img class="docsimg" src='/img/docs.png' alt="" />Documentation</h1>
                </div>
                <div class="paragraph">
                  <div class="doc-text">
                    <p>Embark on the Arctic Ship and become a member of the most terrible crew in the Arctic Ocean.</p>
                    <p>Your role in the crew will determine your share of the treasures found during your adventures</p>
                    <p>ArcticPirates is a secure decentralized staking protocol that allows pirates to earn loot (AVAX) by joining the ship and choosing their role within the crew. The protocol remunerates the pirates according to their role, the daily earnings vary from 12.5% to 20%. It is possible to claim the rewards at any time. When you stake an amount, you can only claim the rewards generated by the contract. </p>
                    <p>Staking works by locking a certain amount of AVAX, then you receive passive income.</p>
                    <p class="roletitle"><img class="cross" src='/img/icons/pirate-flag_1f3f4-200d-2620-fe0f.png' alt="" />The different roles within the crew : </p>
                    <p class="min-text">Striker : Daily Earnings : 20% - Total Return : 140% - Duration : 7 days - Claim Rewards : Any Time  </p>
                    <p class="min-text">Navigator : Daily Earnings : 18.5% - Total Return : 203.5% - Duration : 11 days - Claim Rewards : Any Time  </p>
                    <p class="min-text">Carpenter : Daily Earnings : 17% - Total Return : 255% - Duration : 15 days - Claim Rewards : Any Time  </p>
                    <p class="min-text">Boatswain : Daily Earnings : 15.5% - Total Return : 294.5% - Duration : 19 days - Claim Rewards : Any Time  </p>
                    <p class="min-text">Quartermaster : Daily Earnings : 14% - Total Return : 322% - Duration : 23 days - Claim Rewards : Any Time </p>
                    <p class="min-text">Captain : Daily Earnings : 12.5% - Total Return : 337.5% - Duration : 27 days - Claim Rewards : Any Time  </p>
                    <p class="roletitle"><img class="cross" src='/img/icons/scroll_1f4dc.png' alt="" />Contract Informations :</p>
                    <p>There is a 10% tax on claims which is automatically sent to the contract to make it more sustainable. There is also a 10% tax when staking. The minimum amount for staking is 0.1 AVAX. The contract has been audited several times, contains no vulnerabilities and no backdoors. There are no underflow/overflow vulnerabilities or reentrancy vulnerabilities.</p>
                    <p class="roletitle"><img class="cross" src='/img/icons/snow-capped-mountain_1f3d4-fe0f.png' alt="" />Referral program :</p>
                    <p>You will receive : 5% from each level 1 referral deposits, 3% from each level 2 referral deposits, 2% from each level 3 referral deposits. To start receive earnings from referrals you need at least 1 stake.</p>
                  </div>
                </div>
              </div>
            </div>

          </Toolbar>
        </div>
        <div className={classes.dflexRow}>
          <Toolbar component="nav" variant="dense" className={classes.priceSection}>
            {sections2.map((section2, key) => (
              <div className={classes.priceField} key={key}>
                <img className={classes.priceIcon} src={section2.icon} alt='' />
                <Link
                  style={{ textDecoration: "none" }}
                  noWrap
                  key={section2.title}
                  href={section2.url}
                  className={classes.priceValue}
                >
                  {section2.title}
                </Link>

              </div>
            ))}
          </Toolbar>
          <WalletButton {...props} />
        </div>
      </div>
    </>
  );

}
export default HeaderNav
