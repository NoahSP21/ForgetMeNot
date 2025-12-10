package com.example.forgetMeNot.controller;

import com.example.forgetMeNot.model.Profile;
import com.example.forgetMeNot.security.FirebaseTokenUtil;
import com.example.forgetMeNot.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public Profile getProfile(@RequestHeader("Authorization") String token) throws Exception {
        String uid = FirebaseTokenUtil.verify(token);

        Profile profile = profileService.getProfile(uid);

        //if it doesnt exist, returns empty object
        return profile != null ? profile : new Profile();
    }

    @PutMapping
    public void updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody Profile profile) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        profileService.updateProfile(uid, profile);
    }
}
