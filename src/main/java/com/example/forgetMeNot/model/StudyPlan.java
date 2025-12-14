package com.example.forgetMeNot.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class StudyPlan {

    private String id;
    private String title;

    private Map<String, Subject> subjects;

    private Map<String, Object> frequency;

    private Object createdAt;
    private Object nextOccurrence;
}
