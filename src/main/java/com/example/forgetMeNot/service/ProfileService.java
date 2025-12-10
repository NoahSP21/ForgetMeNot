package com.example.forgetMeNot.service;

import com.example.forgetMeNot.model.Profile;
import com.example.forgetMeNot.repository.ProfileRepository;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository repository;

    public Profile getProfile(String uid) throws Exception {
        return repository.getProfile(uid);
    }

    public Profile saveProfile(String uid, Profile profile) throws Exception {
        return repository.saveProfile(uid, profile);
    }

    public void updateProfile(String uid, Profile profile) throws Exception {
        repository.updateProfile(uid, profile);
    }
}
