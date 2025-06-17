/*
  # Create profiles trigger for automatic profile creation

  1. New Function
    - `handle_new_user()` - Creates a profile automatically when a user signs up
  
  2. Trigger
    - Automatically creates a profile entry when a new user is created in auth.users
    
  3. Security
    - Ensures every authenticated user has a corresponding profile
    - Maintains referential integrity for medications table
*/

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();