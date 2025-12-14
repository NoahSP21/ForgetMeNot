package com.example.forgetMeNot.repository;

import com.example.forgetMeNot.model.Room;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class RoomRepository {

    private final Firestore db = FirestoreClient.getFirestore();

    private CollectionReference getCollection(String uid) {
        return db.collection("Users").document(uid).collection("Room");
    }

    public List<Room> getAll(String uid) throws Exception {
        ApiFuture<QuerySnapshot> future = getCollection(uid).get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        List<Room> result = new ArrayList<>();
        for (DocumentSnapshot doc : docs) {
            Room r = doc.toObject(Room.class);
            r.setId(doc.getId());
            result.add(r);
        }
        return result;
    }

    public Room getOne(String uid, String id) throws Exception {
        DocumentSnapshot snap = getCollection(uid).document(id).get().get();
        if (!snap.exists()) return null;

        Room room = snap.toObject(Room.class);
        room.setId(snap.getId());
        return room;
    }

    public Room create(String uid, Room room) throws Exception {
        DocumentReference ref = getCollection(uid).document();
        room.setId(ref.getId());
        ref.set(room).get();
        return room;
    }

    public void update(String uid, Room room) throws Exception {
        getCollection(uid).document(room.getId()).set(room).get();
    }

    public void delete(String uid, String id) throws Exception {
        getCollection(uid).document(id).delete().get();
    }
}
