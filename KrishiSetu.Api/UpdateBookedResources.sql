-- SQL Script to Update Existing Booked Resources
-- This fixes machinery and workers that were booked BEFORE the code changes

-- Update Machinery that has active bookings to "Booked" status
UPDATE Machineries m
INNER JOIN Bookings b ON b.MachineryId = m.Id
SET m.AvailabilityStatus = 'Booked'
WHERE b.PaymentStatus = 'Pending'
  AND m.AvailabilityStatus = 'Available';

-- Update Workers that have active bookings to "Booked" status  
UPDATE WorkerProfiles wp
INNER JOIN Bookings b ON b.WorkerId = wp.Id
SET wp.AvailabilityStatus = 'Booked'
WHERE b.PaymentStatus = 'Pending'
  AND wp.AvailabilityStatus = 'Available';

-- Verify the updates
SELECT 'Machinery Count with Booked Status:' as Info, COUNT(*) as Count 
FROM Machineries WHERE AvailabilityStatus = 'Booked'
UNION ALL
SELECT 'Worker Count with Booked Status:', COUNT(*) 
FROM WorkerProfiles WHERE AvailabilityStatus = 'Booked';
