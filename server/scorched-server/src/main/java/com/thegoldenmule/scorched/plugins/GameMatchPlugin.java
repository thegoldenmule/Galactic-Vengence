package com.thegoldenmule.scorched.plugins;

import com.electrotank.electroserver5.extensions.BasePlugin;
import com.electrotank.electroserver5.extensions.api.value.EsObjectRO;

/**
 * Author: thegoldenmule
 */
public class GameMatchPlugin extends BasePlugin {
    @Override
    public void init(EsObjectRO parameters) {
        getApi().getLogger().warn("Initialized GameMatchPlugin");
    }
}
