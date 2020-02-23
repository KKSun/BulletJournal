package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.Before;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "completed_tasks",
        indexes = {@Index(name = "completed_task_project_id_index", columnList = "project_id")})
public class CompletedTask extends ProjectItemModel {

    @Id
    @GeneratedValue(generator = "completed_task_generator")
    @SequenceGenerator(
            name = "completed_task_generator",
            sequenceName = "completed_task_sequence"
    )
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "due_date", length = 15)
    private String dueDate; // "yyyy-MM-dd"

    @Column(name = "due_time", length = 10)
    private String dueTime; // "HH-mm"

    @Column(name = "timezone")
    private String timezone;

    @Column(name = "reminder_date", length = 15)
    private String reminderDate; // "yyyy-MM-dd"

    @Column(name = "reminder_time", length = 10)
    private String reminderTime; // "HH-mm"

    // reminder before task
    @Column(name = "reminder_before_task")
    private Before reminderBeforeTask;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getDueTime() {
        return dueTime;
    }

    public void setDueTime(String dueTime) {
        this.dueTime = dueTime;
    }

    public String getTimezone() { return timezone; }

    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getReminderDate() {
        return reminderDate;
    }

    public void setReminderDate(String reminderDate) {
        this.reminderDate = reminderDate;
    }

    public boolean hasReminderDate() {
        return this.reminderDate != null;
    }

    public String getReminderTime() {
        return reminderTime;
    }

    public boolean hasReminderTime() {
        return this.reminderTime != null;
    }

    public void setReminderTime(String reminderTime) {
        this.reminderTime = reminderTime;
    }

    public Before getReminderBeforeTask() {
        return reminderBeforeTask;
    }

    public void setReminderBeforeTask(Before reminderBeforeTask) {
        this.reminderBeforeTask = reminderBeforeTask;
    }

    public boolean hasReminderBeforeTask() {
        return this.reminderBeforeTask != null;
    }

}
