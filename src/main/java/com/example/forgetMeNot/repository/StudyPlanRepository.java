package com.example.forgetMeNot.repository;

import com.example.forgetMeNot.model.StudyPlan;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class StudyPlanRepository {

    private final Firestore db = FirestoreClient.getFirestore();

    private CollectionReference getCollection(String uid) {
        return db.collection("Users").document(uid).collection("StudyPlans");
    }

    // -----------------------------
    // GET ALL (ordered by createdAt desc)
    // -----------------------------
    public List<StudyPlan> getAll(String uid) throws Exception {

        ApiFuture<QuerySnapshot> future =
                getCollection(uid)
                        .orderBy("createdAt", Query.Direction.DESCENDING)
                        .get();

        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        List<StudyPlan> result = new ArrayList<>();

        for (DocumentSnapshot doc : docs) {
            StudyPlan plan = doc.toObject(StudyPlan.class);
            plan.setId(doc.getId());
            result.add(plan);
        }
        return result;
    }

    // -----------------------------
    // GET ONE
    // -----------------------------
    public StudyPlan getOne(String uid, String id) throws Exception {
        DocumentSnapshot snap =
                getCollection(uid).document(id).get().get();

        if (!snap.exists()) return null;

        StudyPlan plan = snap.toObject(StudyPlan.class);
        plan.setId(snap.getId());
        return plan;
    }

    // -----------------------------
    // CREATE (GENERATES DOCUMENT ID)
    // -----------------------------
    public StudyPlan create(String uid, StudyPlan plan) throws Exception {

        DocumentReference ref = getCollection(uid).document();
        plan.setId(ref.getId());

        Map<String, Object> payload = new HashMap<>();
        payload.put("title", plan.getTitle());
        payload.put("subjects", plan.getSubjects());
        payload.put("frequency", plan.getFrequency());
        payload.put("createdAt", FieldValue.serverTimestamp());
        payload.put("nextOccurrence", null);

        ref.set(payload).get();

        return plan;
    }

    // -----------------------------
    // UPDATE (PATCH style)
    // -----------------------------
    public void update(String uid, String id, Map<String, Object> data) throws Exception {
        getCollection(uid)
                .document(id)
                .update(data)
                .get();
    }

    // -----------------------------
    // DELETE
    // -----------------------------
    public void delete(String uid, String id) throws Exception {
        getCollection(uid)
                .document(id)
                .delete()
                .get();
    }
}
