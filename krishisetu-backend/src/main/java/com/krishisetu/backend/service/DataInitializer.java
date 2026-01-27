package com.krishisetu.backend.service;

import com.krishisetu.backend.entity.MachineryCategory;
import com.krishisetu.backend.entity.Role;
import com.krishisetu.backend.entity.User;
import com.krishisetu.backend.repository.MachineryCategoryRepository;
import com.krishisetu.backend.repository.RoleRepository;
import com.krishisetu.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private MachineryCategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles
        seedRole("ROLE_USER");
        seedRole("ROLE_ADMIN");
        seedRole("ROLE_SUPER_ADMIN");
        seedRole("ROLE_FARMER");
        seedRole("ROLE_OWNER");
        seedRole("ROLE_WORKER");

        // Initialize Categories
        seedCategory("Tractor", "Compact and high-power tractors for all farm tasks.");
        seedCategory("Harvester", "Efficient harvesting machinery for various crops.");
        seedCategory("Plow", "Durable plowing equipment for soil preparation.");
        seedCategory("Seeder", "Precision seeding and planting machinery.");
        seedCategory("Sprayer", "Crop protection sprayers and equipment.");

        // Initialize Super Admin
        userRepository.findByEmail("superadmin@krishisetu.com").ifPresentOrElse(user -> {
            user.setEnabled(true);
            user.setApproved(true);
            userRepository.save(user);
        }, () -> {
            User superAdmin = new User();
            superAdmin.setFirstName("Super");
            superAdmin.setLastName("Admin");
            superAdmin.setEmail("superadmin@krishisetu.com");
            superAdmin.setPassword(encoder.encode("admin123"));
            superAdmin.setEnabled(true);
            superAdmin.setApproved(true);

            Set<Role> roles = new HashSet<>();
            roleRepository.findByName("ROLE_SUPER_ADMIN").ifPresent(roles::add);
            superAdmin.setRoles(roles);

            userRepository.save(superAdmin);
            System.out.println("Super Admin created with email: superadmin@krishisetu.com");
        });
    }

    private void seedRole(String roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
    }

    private void seedCategory(String name, String description) {
        if (categoryRepository.findByName(name).isEmpty()) {
            MachineryCategory category = new MachineryCategory();
            category.setName(name);
            category.setDescription(description);
            categoryRepository.save(category);
        }
    }
}
