package com.example.forgetMeNot.service;

import com.example.forgetMeNot.model.Reminder;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReminderService {
    private final Firestore db = FirestoreClient.getFirestore();

    public List<Reminder> getReminders(String uid) throws Exception {
        CollectionReference ref = db.collection("Users")
                .document(uid)
                .collection("Reminders");

        List<QueryDocumentSnapshot> docs = ref.get().get().getDocuments();

        List<Reminder> result = new ArrayList<>();
        for (QueryDocumentSnapshot d : docs) {
            Reminder r = d.toObject(Reminder.class);
            r.setId(d.getId());
            result.add(r);
        }

        return result;
    }

    public Reminder addReminder(String uid, Reminder reminder) throws Exception {
        DocumentReference ref = db.collection("Users")
                .document(uid)
                .collection("Reminders")
                .document();

        ref.set(reminder);
        reminder.setId(ref.getId());
        return reminder;
    }

    public void updateReminder(String uid, Reminder reminder) throws Exception {
        db.collection("Users")
                .document(uid)
                .collection("Reminders")
                .document(reminder.getId())
                .update("title", reminder.getTitle(),
                        "description", reminder.getDescription());
    }

    public void deleteReminder(String uid, String id) throws Exception {
        db.collection("Users")
                .document(uid)
                .collection("Reminders")
                .document(id)
                .delete();
    }
}


