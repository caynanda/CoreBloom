#!/bin/bash

# Create the exercises directory if it doesn't exist
mkdir -p public/exercises

# Workout A Images
curl -o public/exercises/bodyweight-squats.jpg https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop
curl -o public/exercises/glute-bridges.jpg https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=600&h=400&fit=crop
curl -o public/exercises/reverse-lunges.jpg https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=400&fit=crop
curl -o public/exercises/wall-sit.jpg https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop
curl -o public/exercises/calf-raises.jpg https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=600&h=400&fit=crop

# Workout B Images
curl -o public/exercises/band-rows.jpg https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?w=600&h=400&fit=crop
curl -o public/exercises/band-chest-press.jpg https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop
curl -o public/exercises/overhead-press.jpg https://images.unsplash.com/photo-1581009137042-c552e485697a?w=600&h=400&fit=crop
curl -o public/exercises/bicep-curls.jpg https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop
curl -o public/exercises/tricep-extensions.jpg https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&h=400&fit=crop

# Workout C Images
curl -o public/exercises/plank.jpg https://images.unsplash.com/photo-1566241142559-40a9552895d2?w=600&h=400&fit=crop
curl -o public/exercises/bird-dog.jpg https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop
curl -o public/exercises/dead-bug.jpg https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=600&h=400&fit=crop
curl -o public/exercises/cat-cow.jpg https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop
curl -o public/exercises/childs-pose.jpg https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&h=400&fit=crop

echo "Exercise images downloaded successfully." 