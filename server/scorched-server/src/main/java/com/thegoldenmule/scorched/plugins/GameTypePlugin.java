package com.thegoldenmule.scorched.plugins;

import com.electrotank.electroserver5.extensions.BasePlugin;
import com.electrotank.electroserver5.extensions.api.value.*;

/**
 * Author: thegoldenmule
 */
public class GameTypePlugin extends BasePlugin {
    @Override
    public void init(EsObjectRO parameters) {
        getApi().getLogger().warn("GameTypePlugin initialized.");

        // init the match gametype
        ExtensionComponentConfiguration match = new ExtensionComponentConfiguration();
        match.setExtensionName("ScorchedServer");
        match.setHandle("GameMatchPlugin");

        RoomConfiguration roomConfiguration = new RoomConfiguration();
        roomConfiguration.setCapacity(2);
        roomConfiguration.setDescription("A two player match game.");
        roomConfiguration.addPlugin(match);

        GameConfiguration gameConfiguration = new GameConfiguration();
        gameConfiguration.setReceivingRoomListUpdates(true);
        gameConfiguration.setReceivingRoomVariableUpdates(true);
        gameConfiguration.setReceivingUserListUpdates(true);
        gameConfiguration.setReceivingUserVariableUpdates(true);
        gameConfiguration.setReceivingVideoEvents(false);
        gameConfiguration.setRoomConfiguration(roomConfiguration);

        EsObject esob = new EsObject();
        esob.setBoolean("open", true);

        gameConfiguration.setInitialGameDetails(esob);

        getApi().registerGameConfiguration("MatchGame", gameConfiguration);
        getApi().getLogger().warn("MatchGame has been registered.");
    }
}
