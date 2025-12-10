package com.example.forgetMeNot.service;

import com.example.forgetMeNot.model.Reminder;
import com.example.forgetMeNot.repository.ReminderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderService {

    private final ReminderRepository repository;

    public ReminderService(ReminderRepository repository) {
        this.repository = repository;
    }

    public List<Reminder> getReminders(String uid) throws Exception {
        return repository.findAll(uid);
    }

    public Reminder addReminder(String uid, Reminder reminder) throws Exception {
        return repository.save(uid, reminder);
    }

    public void updateReminder(String uid, Reminder reminder) throws Exception {
        repository.update(uid, reminder);
    }

    public void deleteReminder(String uid, String id) throws Exception {
        repository.delete(uid, id);
    }
}
