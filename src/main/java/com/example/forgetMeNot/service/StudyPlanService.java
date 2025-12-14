package com.example.forgetMeNot.service;

import com.example.forgetMeNot.model.StudyPlan;
import com.example.forgetMeNot.repository.StudyPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class StudyPlanService {

    @Autowired
    private StudyPlanRepository repo;

    public List<StudyPlan> getPlans(String uid) throws Exception {
        return repo.getAll(uid);
    }

    public StudyPlan getPlan(String uid, String id) throws Exception {
        return repo.getOne(uid, id);
    }

    public StudyPlan create(String uid, StudyPlan plan) throws Exception {
        return repo.create(uid, plan);
    }

    public void update(String uid, String id, Map<String, Object> data) throws Exception {
        repo.update(uid, id, data);
    }

    public void delete(String uid, String id) throws Exception {
        repo.delete(uid, id);
    }
}
