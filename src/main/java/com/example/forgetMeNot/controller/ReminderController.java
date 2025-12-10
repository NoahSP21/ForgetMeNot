package com.example.forgetMeNot.controller;

import com.example.forgetMeNot.model.Reminder;
import com.example.forgetMeNot.security.FirebaseTokenUtil;
import com.example.forgetMeNot.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
    @Autowired
    private ReminderService service;

    @GetMapping
    public List<Reminder> getAll(@RequestHeader("Authorization") String token) throws Exception {
        String uid = FirebaseTokenUtil.verify(token);
        return service.getReminders(uid);
    }

    @PostMapping
    public Reminder add(
            @RequestHeader("Authorization") String token,
            @RequestBody Reminder reminder) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        return service.addReminder(uid, reminder);
    }

    @PutMapping("/{id}")
    public void update(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody Reminder reminder) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        reminder.setId(id);
        service.updateReminder(uid, reminder);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        service.deleteReminder(uid, id);
    }
}
