package com.example.forgetMeNot.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

public class FirebaseTokenUtil {

    public static String verify(String authHeader) throws Exception {
        if (!authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }

        String token = authHeader.replace("Bearer ", "");
        FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(token);

        return decoded.getUid();
    }
}

