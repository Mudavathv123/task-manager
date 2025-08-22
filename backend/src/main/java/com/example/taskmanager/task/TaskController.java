package com.example.taskmanager.task;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskmanager.user.User;
import com.example.taskmanager.user.UserRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public record TaskRequest(@NotBlank String title, String description, Boolean completed) {}
    
    public record TaskUpdateRequest(String title, String description, Boolean completed) {}

    @GetMapping
    public List<Task> list(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return taskRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Task> create(Authentication auth, @Valid @RequestBody TaskRequest request) {
        Long userId = getUserIdFromAuth(auth);
        Task t = new Task();
        t.setUserId(userId);
        t.setTitle(request.title());
        t.setDescription(request.description());
        t.setCompleted(request.completed() != null && request.completed());
        return ResponseEntity.ok(taskRepository.save(t));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(Authentication auth, @PathVariable("id") Long id, @Valid @RequestBody TaskUpdateRequest request) {
        try {
            Long userId = getUserIdFromAuth(auth);
            return taskRepository.findById(id)
                    .filter(t -> t.getUserId().equals(userId))
                    .<ResponseEntity<?>>map(t -> {
                        if (request.title() != null) t.setTitle(request.title());
                        if (request.description() != null) t.setDescription(request.description());
                        if (request.completed() != null) t.setCompleted(request.completed());
                        return ResponseEntity.ok(taskRepository.save(t));
                    })
                    .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Task not found")));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update task", "details", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(Authentication auth, @PathVariable("id") Long id) {
        try {
            System.out.println("Attempting to delete task with ID: " + id);
            Long userId = getUserIdFromAuth(auth);
            System.out.println("User ID from auth: " + userId);
            
            var taskOpt = taskRepository.findById(id);
            if (taskOpt.isEmpty()) {
                System.out.println("Task not found with ID: " + id);
                return ResponseEntity.status(404).body(Map.of("error", "Task not found"));
            }
            
            Task task = taskOpt.get();
            System.out.println("Found task: " + task.getTitle() + ", User ID: " + task.getUserId());
            
            if (!task.getUserId().equals(userId)) {
                System.out.println("Task belongs to user " + task.getUserId() + ", but current user is " + userId);
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }
            
            System.out.println("Deleting task: " + task.getTitle());
            taskRepository.delete(task);
            System.out.println("Task deleted successfully");
            
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting task: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to delete task", 
                "details", e.getMessage(),
                "type", e.getClass().getSimpleName()
            ));
        }
    }

    private Long getUserIdFromAuth(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.UNAUTHORIZED,
                        "User not found"
                ));
        return user.getId();
    }
}


