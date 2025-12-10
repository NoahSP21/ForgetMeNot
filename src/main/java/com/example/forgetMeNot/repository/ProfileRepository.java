package com.example.forgetMeNot.repository;

import com.example.forgetMeNot.model.Profile;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

@Repository
public class ProfileRepository {

    private final Firestore db = FirestoreClient.getFirestore();

    public Profile getProfile(String uid) throws Exception {
        DocumentReference ref = db.collection("Users").document(uid);
        DocumentSnapshot snapshot = ref.get().get();

        if (!snapshot.exists()) return null;

        return snapshot.toObject(Profile.class);
    }

    public Profile saveProfile(String uid, Profile profile) throws Exception {
        db.collection("Users")
                .document(uid)
                .set(profile)
                .get();

        return profile;
    }

    public void updateProfile(String uid, Profile profile) throws Exception {
        db.collection("Users")
                .document(uid)
                .update(
                        "name", profile.getFirstName(),
                        "last name", profile.getLastName(),
                        "email", profile.getEmail()
                ).get();
    }
}
