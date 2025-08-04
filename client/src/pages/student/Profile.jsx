import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Course from './Course';
import {
  useLoadUserQuery,
  useUpdateUserMutation
} from '@/features/api/authApi';
import { toast } from 'sonner';

const Profile = () => {
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess }] = useUpdateUserMutation();

  const user = data?.user;

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData.message || 'Profile updated.');
    }
    if (isError) {
      toast.error(error.message || 'Failed to update.');
    }
  }, [error, updateUserData, isSuccess, isError]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('profilePhoto', profilePhoto);
    await updateUser(formData);
  };

  if (isLoading)
    return <h1 className="text-center mt-10 text-white">Loading profile...</h1>;

  if (!data || !data.user)
    return <h1 className="text-center mt-10 text-red-500">User not found or not logged in.</h1>;

  return (
    <div className="max-w-4xl mx-auto px-4 my-24 text-white">
      <h1 className="font-bold text-3xl text-center md:text-left mb-6">Your Profile</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        <Avatar className="h-28 w-28 md:h-36 md:w-36 shadow-lg">
          <AvatarImage src={user?.photoUrl || 'https://github.com/shadcn.png'} alt={user.name} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="w-full md:flex-1">
          <div className="space-y-3">
            <p className="text-lg">
              <span className="font-semibold text-gray-200">Name:</span>
              <span className="ml-2 text-gray-400">{user.name}</span>
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-200">Email:</span>
              <span className="ml-2 text-gray-400">{user.email}</span>
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-200">Role:</span>
              <span className="ml-2 text-gray-400">{user.role.toUpperCase()}</span>
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-6" size="sm" text-white >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile. Click save when done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="photo">Profile Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={onChangeHandler}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-semibold text-xl mb-4">Courses You Are Enrolled In</h2>
        {user.enrolledCourses.length === 0 ? (
          <p className="text-gray-400">You haven't enrolled in any course yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {user.enrolledCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
