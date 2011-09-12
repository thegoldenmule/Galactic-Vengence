package com.thegoldenmule.scorched.extensions;

import com.electrotank.electroserver5.extensions.BaseLoginEventHandler;
import com.electrotank.electroserver5.extensions.ChainAction;
import com.electrotank.electroserver5.extensions.LoginContext;
import com.electrotank.electroserver5.extensions.api.value.EsObjectRO;

import java.util.Random;

/**
 * Author: thegoldenmule
 */
public class LoginHandler extends BaseLoginEventHandler {
    private static final Random randomNumber = new Random();

    @Override
    public void init(EsObjectRO parameters) {
        getApi().getLogger().warn("LoginHandler initialized.");
    }

    @Override
    public ChainAction executeLogin(LoginContext context) {
        getApi().getLogger().warn("Executing login.");
        if (null == context.getUserName() || "".equals(context.getUserName())) {
            context.setUserName("User-" + randomNumber.nextInt());
        }

        return ChainAction.OkAndContinue;
    }
}
