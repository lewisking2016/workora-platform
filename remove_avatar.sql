UPDATE worker_profiles 
SET avatar_url = NULL 
WHERE user_id IN (SELECT id FROM users WHERE username = 'lewisking2016');
