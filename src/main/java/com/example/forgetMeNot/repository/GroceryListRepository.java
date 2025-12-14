package com.example.forgetMeNot.repository;

import com.example.forgetMeNot.model.GroceryList;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class GroceryListRepository {

    private final Firestore db = FirestoreClient.getFirestore();

    private CollectionReference getCollection(String uid) {
        return db.collection("Users").document(uid).collection("GroceryLists");
    }

    public List<GroceryList> getAll(String uid) throws Exception {
        ApiFuture<QuerySnapshot> future = getCollection(uid).get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        List<GroceryList> result = new ArrayList<>();
        for (DocumentSnapshot doc : docs) {
            GroceryList list = doc.toObject(GroceryList.class);
            list.setId(doc.getId());
            result.add(list);
        }
        return result;
    }

    public GroceryList getOne(String uid, String id) throws Exception {
        DocumentSnapshot snap = getCollection(uid).document(id).get().get();
        if (!snap.exists()) return null;

        GroceryList list = snap.toObject(GroceryList.class);
        list.setId(snap.getId());
        return list;
    }

    public GroceryList create(String uid, GroceryList list) throws Exception {
        DocumentReference ref = getCollection(uid).document();
        list.setId(ref.getId());
        ref.set(list).get();
        return list;
    }

    public void update(String uid, GroceryList list) throws Exception {
        getCollection(uid).document(list.getId()).set(list).get();
    }

    public void delete(String uid, String id) throws Exception {
        getCollection(uid).document(id).delete().get();
    }
}
