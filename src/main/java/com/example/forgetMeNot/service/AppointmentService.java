package com.example.forgetMeNot.service;

import com.example.forgetMeNot.model.Appointment;
import com.example.forgetMeNot.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository repo;

    private static final List<String> DEFAULT_SECTIONS =
            List.of("WORK", "DOCTOR", "TRAVEL");

    public List<Appointment> getAll(String uid) throws Exception {
        return repo.getAll(uid);
    }

    public List<Appointment> getByConfirmed(String uid, boolean confirmed) throws Exception {
        return repo.getByConfirmed(uid, confirmed);
    }

    public List<String> getAllSections(String uid) throws Exception {
        List<Appointment> all = repo.getAll(uid);

        Set<String> dynamic = new HashSet<>();

        for (Appointment a : all) {
            if (a.getSection() != null &&
                    !DEFAULT_SECTIONS.contains(a.getSection())) {
                dynamic.add(a.getSection());
            }
        }

        List<String> result = new ArrayList<>(DEFAULT_SECTIONS);
        result.addAll(dynamic);

        return result;
    }

    public Appointment create(String uid, Appointment a) throws Exception {
        return repo.create(uid, a);
    }

    public void update(String uid, Appointment a) throws Exception {
        repo.update(uid, a);
    }

    public void delete(String uid, String id) throws Exception {
        repo.delete(uid, id);
    }
}
