import React from 'react';

import InformationSection from 'components/Login/SiteInformation/InformationSection/InformationSection';

const SiteInformation = () => {
    return (
        <div className="SiteInformation">
            <InformationSection sectionNumber={1} title="Looking for a group?" button="Find a group" imgName="lfg-img">
                <p>
                    Simply login and you are good to go. FireTeam.gg automatically grabs your 5 most played heroes and makes them visible to anyone looking for more members.
                </p>
                <br/>
                <p>
                    If you want to play other heroes, you can change the 5 heroes that are displayed to other users at any time.
                </p>
            </InformationSection>

            <InformationSection sectionNumber={2} title="Looking for more?" button="Find more members" imgName="lfm-img">
                <p>
                    FireTeam.gg helps you build the perfect team comp with the perfect members FAST!
                </p>
            </InformationSection>

            <InformationSection sectionNumber={3} title="No waiting necessary" button="Find a group" imgName="pending-invite-img">
                <p>
                    Every player you see is currently on the site, so there is no need to wonder if the player you just invited is still online.
                    <br/>
                    <br/>
                    FireTeam.gg removes players from search if they:
                </p>
                <ol>
                    <li><p>1) Are inactive for more than 10 min</p></li>
                    <li><p>2) Exit the site</p></li>
                    <li><p>3) Logout</p></li>
                </ol>
                <br/>
                <p>
                    Additionally, all invites timeout after 30 seconds, so you are not stuck waiting for a response.
                </p>
            </InformationSection>

            <InformationSection sectionNumber={4} title="Filtered Heroes" button="Find a group" imgName="filter-heroes-img">
                <p>
                    FireTeam.gg makes it easy to find what you're looking for by splitting heroes role lists: offense, defense, tank, and support.
                </p>
                <br/>
                <p>
                    Furthermore, heroes are then sorted in their respective role list by win rate.
                </p>
            </InformationSection>

            <InformationSection sectionNumber={5} title="Individual Hero Stats" button="Find a group" imgName="hero-stats-img">
                <p>
                    FireTeam.gg gives you access to key performance indicators for each of a player's heroes so that you can choose the Pharah you think will fit your team's needs the best.
                </p>
            </InformationSection>
        </div>
    );
};

export default SiteInformation;