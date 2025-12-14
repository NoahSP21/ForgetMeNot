package com.example.forgetMeNot.service;

import com.example.forgetMeNot.model.Room;
import com.example.forgetMeNot.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository repo;

    public List<Room> getRooms(String uid) throws Exception {
        return repo.getAll(uid);
    }

    public Room getRoom(String uid, String id) throws Exception {
        return repo.getOne(uid, id);
    }

    public Room createRoom(String uid, Room room) throws Exception {
        return repo.create(uid, room);
    }

    public void updateRoom(String uid, Room room) throws Exception {
        repo.update(uid, room);
    }

    public void deleteRoom(String uid, String id) throws Exception {
        repo.delete(uid, id);
    }
}
