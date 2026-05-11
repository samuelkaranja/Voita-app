import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  getProfile,
  updateProfile,
  updateVehicle,
  uploadImage,
} from '../redux/slices/profile/profileSlice';

type VehicleForm = {
  plateNumber: string;
  model: string;
  year: string;
  color: string;
  image: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;

  oilType: string;
  tirePressure: string;
  tireConfig: string;

  vehicle: VehicleForm;

  insuranceRenewal: Date | null;
  licenseExpiry: Date | null;
  nextServiceDate: Date | null;
  tireExpiry: Date | null;
};

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  profileImage: '',

  oilType: '',
  tirePressure: '',
  tireConfig: '',

  vehicle: {
    plateNumber: '',
    model: '',
    year: '',
    color: '',
    image: '',
  },

  insuranceRenewal: null,
  licenseExpiry: null,
  nextServiceDate: null,
  tireExpiry: null,
};

export function useProfileForm() {
  const dispatch = useDispatch<any>();

  const { user, vehicle, config, reminders, loading } = useSelector(
    (state: RootState) => state.profile,
  );

  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // FETCH PROFILE ON LOAD
  // =========================
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // =========================
  // ATOMIC SYNC (FIXED)
  // =========================
  useEffect(() => {
    if (!user && !vehicle && !config && !reminders) return;

    const getReminder = (type: string) =>
      reminders?.find(r => r.type === type);

    const insurance = getReminder('insurance');
    const license = getReminder('license');
    const service = getReminder('service');
    const tire = getReminder('tire');

    setForm({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      profileImage: user?.avatar ?? '',

      oilType: config?.oilType ?? '',
      tirePressure: config?.tirePressure ?? '',
      tireConfig: config?.tireSetup ?? '',

      vehicle: {
        plateNumber: vehicle?.plateNumber ?? '',
        model: vehicle?.name ?? '',
        year: String(vehicle?.year ?? ''),
        color: vehicle?.color ?? '',
        image: vehicle?.imageUrl ?? '',
      },

      insuranceRenewal: insurance?.dueDate
        ? new Date(insurance.dueDate)
        : null,

      licenseExpiry: license?.expiryDate
        ? new Date(license.expiryDate)
        : null,

      nextServiceDate: service?.dueDate
        ? new Date(service.dueDate)
        : null,

      tireExpiry: tire?.expiryDate
        ? new Date(tire.expiryDate)
        : null,
    });
  }, [user, vehicle, config, reminders]);

  // =========================
  // HANDLERS
  // =========================
  const handleChange = useCallback((key: keyof FormState, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleVehicleChange = useCallback((key: keyof VehicleForm, value: string) => {
    setForm(prev => ({
      ...prev,
      vehicle: { ...prev.vehicle, [key]: value },
    }));
  }, []);

  const handleDateChange = useCallback((key: keyof FormState, date: Date) => {
    setForm(prev => ({ ...prev, [key]: date }));
  }, []);

  // =========================
  // IMAGE UPLOAD WRAPPERS
  // =========================
  const uploadProfileImage = async (image: any) => {
    const url = await dispatch(
      uploadImage({ image, folder: 'voita/avatars' }),
    ).unwrap();

    handleChange('profileImage', url);
  };

  const uploadVehicleImage = async (image: any) => {
    const url = await dispatch(
      uploadImage({ image, folder: 'voita/vehicles' }),
    ).unwrap();

    handleVehicleChange('image', url);
  };

  // =========================
  // SUBMIT
  // =========================
  const submit = async () => {
    try {
      setSubmitting(true);

      await dispatch(
        updateProfile({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          avatar: form.profileImage,
        }),
      ).unwrap();

      if (vehicle?.id) {
        await dispatch(
          updateVehicle({
            vehicleId: vehicle.id,
            payload: {
              color: form.vehicle.color,
              year: Number(form.vehicle.year),
              imageUrl: form.vehicle.image,
              oilType: form.oilType,
              tirePressure: form.tirePressure,
              tireSetup: form.tireConfig,
            },
          }),
        ).unwrap();
      }
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // RESET (optional)
  // =========================
  const reset = () => setForm(emptyForm);

  return {
    form,
    loading,
    submitting,

    handleChange,
    handleVehicleChange,
    handleDateChange,

    uploadProfileImage,
    uploadVehicleImage,

    submit,
    reset,
  };
}
