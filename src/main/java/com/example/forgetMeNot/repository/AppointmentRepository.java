package com.example.forgetMeNot.repository;

import com.example.forgetMeNot.model.Appointment;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class AppointmentRepository {

    private final Firestore db = FirestoreClient.getFirestore();

    private CollectionReference getCollection(String uid) {
        return db.collection("Users")
                .document(uid)
                .collection("Appointments");
    }

    public List<Appointment> getAll(String uid) throws Exception {
        ApiFuture<QuerySnapshot> future = getCollection(uid).get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        List<Appointment> result = new ArrayList<>();
        for (QueryDocumentSnapshot d : docs) {
            Appointment a = d.toObject(Appointment.class);
            a.setId(d.getId());
            result.add(a);
        }
        return result;
    }

    public List<Appointment> getByConfirmed(String uid, boolean confirmed) throws Exception {
        ApiFuture<QuerySnapshot> future = getCollection(uid)
                .whereEqualTo("confirmed", confirmed)
                .get();

        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        List<Appointment> result = new ArrayList<>();

        for (QueryDocumentSnapshot d : docs) {
            Appointment a = d.toObject(Appointment.class);
            a.setId(d.getId());
            result.add(a);
        }
        return result;
    }

    public Appointment create(String uid, Appointment a) throws Exception {
        DocumentReference ref = getCollection(uid).document();
        a.setId(ref.getId());
        ref.set(a).get();
        return a;
    }

    public void update(String uid, Appointment a) throws Exception {
        getCollection(uid)
                .document(a.getId())
                .update(
                        "title", a.getTitle(),
                        "section", a.getSection(),
                        "date", a.getDate(),
                        "time", a.getTime(),
                        "confirmed", a.isConfirmed(),
                        "createdAt", a.getCreatedAt()
                )
                .get();
    }

    public void delete(String uid, String id) throws Exception {
        getCollection(uid).document(id).delete().get();
    }
}
