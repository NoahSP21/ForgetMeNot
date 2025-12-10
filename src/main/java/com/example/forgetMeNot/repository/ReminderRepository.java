package com.example.forgetMeNot.repository;

import com.example.forgetMeNot.model.Reminder;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ReminderRepository {

    private final Firestore db = FirestoreClient.getFirestore();

    private CollectionReference getReminderCollection(String uid) {
        return db.collection("Users")
                .document(uid)
                .collection("Reminders");
    }

    public List<Reminder> findAll(String uid) throws Exception {
        CollectionReference ref = getReminderCollection(uid);

        ApiFuture<QuerySnapshot> future = ref.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        List<Reminder> results = new ArrayList<>();
        for (QueryDocumentSnapshot d : docs) {
            Reminder r = d.toObject(Reminder.class);
            r.setId(d.getId());
            results.add(r);
        }

        return results;
    }

    public Reminder save(String uid, Reminder reminder) throws Exception {
        DocumentReference ref = getReminderCollection(uid).document();

        ApiFuture<WriteResult> future = ref.set(reminder);
        future.get(); // espera a Firestore

        reminder.setId(ref.getId());
        return reminder;
    }

    public void update(String uid, Reminder reminder) throws Exception {
        DocumentReference ref = getReminderCollection(uid).document(reminder.getId());

        ApiFuture<WriteResult> future = ref.update(
                "title", reminder.getTitle(),
                "description", reminder.getDescription()
        );
        future.get();
    }

    public void delete(String uid, String id) throws Exception {
        DocumentReference ref = getReminderCollection(uid).document(id);

        ApiFuture<WriteResult> future = ref.delete();
        future.get();
    }
}
