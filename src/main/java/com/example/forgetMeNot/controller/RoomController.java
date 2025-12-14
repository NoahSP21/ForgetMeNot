package com.example.forgetMeNot.controller;

import com.example.forgetMeNot.model.Room;
import com.example.forgetMeNot.security.FirebaseTokenUtil;
import com.example.forgetMeNot.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService service;

    @GetMapping
    public List<Room> getAll(@RequestHeader("Authorization") String token) throws Exception {
        String uid = FirebaseTokenUtil.verify(token);
        return service.getRooms(uid);
    }

    @GetMapping("/{id}")
    public Room getOne(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        return service.getRoom(uid, id);
    }

    @PostMapping
    public Room create(
            @RequestHeader("Authorization") String token,
            @RequestBody Room room) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        return service.createRoom(uid, room);
    }

    @PutMapping("/{id}")
    public void update(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody Room room) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        room.setId(id);
        service.updateRoom(uid, room);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        service.deleteRoom(uid, id);
    }
}
