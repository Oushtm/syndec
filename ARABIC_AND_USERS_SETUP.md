# Arabic Language & User Management Setup Guide

## 🌍 Arabic Language Support

### Features
- ✅ Full Arabic translation (RTL support)
- ✅ Language switcher in navigation
- ✅ Automatic RTL layout for Arabic
- ✅ Bilingual interface (English/Arabic)
- ✅ Language preference saved in localStorage

### How to Use
1. Click the language switcher (Globe icon) in the top navigation
2. Toggle between English (EN) and Arabic (AR)
3. The entire interface will switch languages instantly
4. Your preference is saved automatically

### Translation Coverage
- All navigation items
- All page titles and descriptions
- All buttons and actions
- All form labels
- All table headers
- All messages and alerts

## 👥 User Management System

### Features
- ✅ User roles: Admin, Manager, Viewer
- ✅ Granular permissions system
- ✅ User CRUD operations
- ✅ Permission-based access control
- ✅ User profile management

### User Roles

#### Admin
- Full access to all features
- Can manage users
- Can edit/delete anything
- Can change settings

#### Manager
- Can view and edit data
- Cannot manage users
- Cannot delete records (unless permission granted)
- Can manage apartments, payments, expenses

#### Viewer
- Read-only access
- Can view all data
- Cannot make changes
- Cannot manage users

### Permissions
Each user can have specific permissions:
- **Can View**: View all data
- **Can Edit**: Edit apartments, payments, expenses
- **Can Delete**: Delete records
- **Can Manage Users**: Add/edit/delete users

### Setting Up Users

#### Option 1: Manual Setup (Quick Start)

1. **Enable Authentication in Supabase**
   - Go to Supabase Dashboard → Authentication → Settings
   - Enable Email authentication
   - Configure email templates (optional)

2. **Create First Admin User**
   - Go to Authentication → Users
   - Click "Add User"
   - Enter email and password
   - User will be created automatically
   - Go to Table Editor → user_profiles
   - Find the user and update:
     - `role` = 'admin'
     - `can_manage_users` = true
     - `can_edit` = true
     - `can_delete` = true

3. **Create Additional Users**
   - Use the Users page in the app (if you're admin)
   - Or create manually in Supabase Dashboard
   - Set appropriate role and permissions

#### Option 2: Serverless Function (Recommended for Production)

For automatic user creation, set up a Supabase Edge Function:

1. **Create Edge Function**
   ```bash
   supabase functions create create-user
   ```

2. **Deploy the function** (see `src/utils/userManagement.md`)

3. **Update environment variables**
   - Add `SUPABASE_SERVICE_ROLE_KEY` to function secrets

4. **Users can now be created automatically** from the UI

### Database Schema

Run the updated `supabase-schema.sql` which includes:
- `user_profiles` table
- Automatic profile creation trigger
- Row Level Security policies
- Permission fields

### Using User Management

1. **Access Users Page**
   - Only visible to Admins and users with `can_manage_users` permission
   - Click "Users" in the sidebar

2. **Add New User**
   - Click "Add User"
   - Fill in email, name, password
   - Select role
   - Set permissions
   - Click "Create"

3. **Edit User**
   - Click edit icon on user card
   - Update information
   - Change permissions
   - Click "Update"

4. **Delete User**
   - Click delete icon
   - Confirm deletion
   - User profile will be deleted
   - (Auth user deletion requires Supabase Dashboard or serverless function)

### Permission-Based Access

The system automatically:
- Hides "Users" menu from non-admins
- Prevents unauthorized actions
- Shows permission errors
- Protects routes based on permissions

### Important Notes

1. **First User Setup**
   - Create your first admin user manually in Supabase Dashboard
   - Update their profile to have admin role
   - Then you can manage other users from the app

2. **User Creation**
   - Currently uses `signUp` which requires email confirmation
   - For production, use serverless function with admin API
   - See `src/utils/userManagement.md` for details

3. **User Deletion**
   - Profile deletion works from UI
   - Auth user deletion requires Supabase Dashboard or serverless function
   - Or use the admin API from a serverless function

4. **Permissions**
   - Admins automatically have all permissions
   - Other roles need explicit permission grants
   - Permissions are checked on every action

## 🔐 Authentication

### Current Setup
- Uses Supabase Auth
- Email/Password authentication
- Session management
- Automatic profile creation

### Login (Future Enhancement)
A login page can be added. For now:
- Users are created via Supabase Dashboard
- Or use the signUp flow (requires email confirmation)
- Sessions are managed automatically

## 📝 Next Steps

1. **Run Updated Schema**
   - Execute the updated `supabase-schema.sql`
   - This adds user_profiles table and triggers

2. **Create First Admin**
   - Create user in Supabase Dashboard
   - Update profile to admin role

3. **Test Language Switcher**
   - Click globe icon
   - Verify Arabic RTL layout
   - Test all pages in both languages

4. **Test User Management**
   - Create test users
   - Test different roles
   - Verify permissions work

## 🎯 Features Summary

### Arabic Language
- ✅ Complete translation
- ✅ RTL layout support
- ✅ Language switcher
- ✅ Persistent preference

### User Management
- ✅ Role-based access (Admin/Manager/Viewer)
- ✅ Granular permissions
- ✅ User CRUD operations
- ✅ Permission-based UI
- ✅ Automatic profile creation

---

**Note**: For production, set up the serverless function for seamless user creation. See `src/utils/userManagement.md` for details.

