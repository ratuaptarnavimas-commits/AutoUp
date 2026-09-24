import { customSupabaseClient, hasSupabaseConfig } from '@/lib/customSupabaseClient';

const getClient = () => {
  if (!hasSupabaseConfig || !customSupabaseClient) {
    throw new Error('Supabase konfiguracija neįdiegta. Pridėkite VITE_SUPABASE_URL ir VITE_SUPABASE_ANON_KEY arba VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  return customSupabaseClient;
};

const requireAdminSession = async () => {
  const supabase = getClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!sessionData.session) {
    const error = new Error('Aktyvi Supabase sesija nerasta.');
    error.code = 'AUTH_SESSION_REQUIRED';
    throw error;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  if (userData.user?.app_metadata?.role !== 'admin') {
    const error = new Error('Reikalinga administratoriaus rolė.');
    error.code = 'ADMIN_ROLE_REQUIRED';
    throw error;
  }

  if (import.meta.env.DEV) {
    console.log('Supabase admin sesija prieš mutaciją:', {
      hasSession: Boolean(sessionData.session),
      userId: userData.user.id,
      userEmail: userData.user.email,
      appMetadata: userData.user.app_metadata,
      role: userData.user.app_metadata?.role,
    });
  }

  return supabase;
};

export const normalizeVehicleIdentifier = (value = '') =>
  String(value)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9]/g, '');

export const normalizeVehicle = (vehicle = {}) => ({
  id: vehicle.id,
  make: vehicle.make || '',
  model: vehicle.model || '',
  year: vehicle.year || null,
  engine: vehicle.engine || '',
  registrationNumber: vehicle.registration_number || vehicle.registrationNumber || '',
  vin: vehicle.vin || '',
  createdAt: vehicle.created_at || null,
  updatedAt: vehicle.updated_at || null,
});

export const normalizeServiceRecord = (record = {}) => ({
  id: record.id,
  date: record.service_date || record.date || '',
  mileage: Number(record.mileage ?? 0),
  category: record.category || 'Periodinis aptarnavimas',
  customerComplaint: record.customer_complaint || record.customerComplaint || '',
  workPerformed: Array.isArray(record.work_performed)
    ? record.work_performed.filter(Boolean)
    : Array.isArray(record.workPerformed)
      ? record.workPerformed.filter(Boolean)
      : [],
  partsUsed: normalizeParts(record.parts_used ?? record.partsUsed),
  materialsUsed: Array.isArray(record.materials_used)
    ? record.materials_used.filter(Boolean)
    : Array.isArray(record.materialsUsed)
      ? record.materialsUsed.filter(Boolean)
      : [],
  publicNotes: record.public_notes || record.publicNotes || '',
  internalNotes: record.internal_notes || record.internalNotes || '',
  performedBy: record.performed_by || record.performedBy || 'AutoUP',
  verifiedByAutoup: Boolean(record.verified_by_autoup ?? record.verifiedByAutoup ?? true),
  createdAt: record.created_at || null,
  updatedAt: record.updated_at || null,
});

function normalizeParts(parts) {
  if (!Array.isArray(parts)) return [];

  return parts
    .filter(Boolean)
    .map((part) => (typeof part === 'string' ? { name: part, location: '' } : {
      name: part.name || '',
      location: part.location || '',
    }))
    .filter((part) => part.name || part.location);
}

const toPartsPayload = (parts) => normalizeParts(parts);

export async function findVehicleByRegistrationNumber(registrationNumber) {
  const supabase = getClient();
  const normalized = normalizeVehicleIdentifier(registrationNumber);

  const { data, error } = await supabase
    .from('vehicles')
    .select('id, make, model, year, engine, registration_number, vin')
    .eq('registration_number', normalized)
    .maybeSingle();
  if (error) throw error;

  return data ? normalizeVehicle(data) : null;
}

export async function findAdminVehicleByRegistrationNumber(registrationNumber) {
  const supabase = await requireAdminSession();
  const normalized = normalizeVehicleIdentifier(registrationNumber);

  const { data, error } = await supabase
    .from('vehicles')
    .select('id, make, model, year, engine, registration_number, vin')
    .eq('registration_number', normalized)
    .maybeSingle();
  if (error) throw error;

  return data ? normalizeVehicle(data) : null;
}

export async function findVehicleByVin(vin) {
  const supabase = getClient();
  const normalized = normalizeVehicleIdentifier(vin);

  const { data, error } = await supabase
    .from('vehicles')
    .select('id, make, model, year, engine, registration_number, vin')
    .eq('vin', normalized)
    .maybeSingle();
  if (error) throw error;

  return data ? normalizeVehicle(data) : null;
}

export async function findAdminVehicleByVin(vin) {
  const supabase = await requireAdminSession();
  const normalized = normalizeVehicleIdentifier(vin);

  const { data, error } = await supabase
    .from('vehicles')
    .select('id, make, model, year, engine, registration_number, vin')
    .eq('vin', normalized)
    .maybeSingle();
  if (error) throw error;

  return data ? normalizeVehicle(data) : null;
}

export async function getVehicleServiceRecords(vehicleId) {
  const supabase = await requireAdminSession();

  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('service_date', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeServiceRecord);
}

export async function getPublicVehicleServiceRecords(vehicleId) {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('public_vehicle_service_records')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('service_date', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeServiceRecord);
}

export async function createVehicle(vehicle) {
  const supabase = await requireAdminSession();
  const registrationNumber = normalizeVehicleIdentifier(vehicle.registrationNumber || vehicle.registration_number);
  const vin = normalizeVehicleIdentifier(vehicle.vin);

  const { data: existingVehicles, error: duplicateCheckError } = await supabase
    .from('vehicles')
    .select('id, registration_number, vin')
    .or(`registration_number.eq.${registrationNumber},vin.eq.${vin}`)
    .limit(1);

  if (duplicateCheckError) throw duplicateCheckError;

  if (existingVehicles?.length) {
    const duplicateError = new Error('Automobilis su tokiu valstybiniu numeriu arba VIN jau egzistuoja.');
    duplicateError.code = 'VEHICLE_DUPLICATE';
    duplicateError.details = existingVehicles[0];
    throw duplicateError;
  }

  const payload = {
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year ?? null,
    engine: vehicle.engine ?? '',
    registration_number: registrationNumber,
    vin,
  };

  const { data, error } = await supabase.from('vehicles').insert(payload).select().single();
  if (error) throw error;

  return normalizeVehicle(data);
}

export async function updateVehicle(vehicleId, updates) {
  const supabase = await requireAdminSession();

  const payload = {
    make: updates.make?.trim(),
    model: updates.model?.trim(),
    year: updates.year === "" || updates.year === null ? null : Number(updates.year),
    engine: updates.engine?.trim() || "",
    registration_number: normalizeVehicleIdentifier(updates.registrationNumber || updates.registration_number),
    vin: normalizeVehicleIdentifier(updates.vin),
  };

  const { data: existingVehicles, error: duplicateCheckError } = await supabase
    .from('vehicles')
    .select('id, registration_number, vin')
    .or(`registration_number.eq.${payload.registration_number},vin.eq.${payload.vin}`)
    .neq('id', vehicleId)
    .limit(1);

  if (duplicateCheckError) throw duplicateCheckError;
  if (existingVehicles?.length) {
    const duplicateError = new Error('Kitas automobilis jau turi tokį valstybinį numerį arba VIN.');
    duplicateError.code = 'VEHICLE_DUPLICATE';
    duplicateError.details = existingVehicles[0];
    throw duplicateError;
  }

  const { data, error } = await supabase
    .from('vehicles')
    .update(payload)
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) throw error;
  return normalizeVehicle(data);
}

export async function createServiceRecord(vehicleId, record) {
  const supabase = await requireAdminSession();

  const payload = {
    vehicle_id: vehicleId,
    service_date: record.date,
    mileage: record.mileage === "" || record.mileage === null || record.mileage === undefined
      ? null
      : Number(record.mileage),
    category: record.category || 'Periodinis aptarnavimas',
    customer_complaint: record.customerComplaint || '',
    work_performed: Array.isArray(record.workPerformed) ? record.workPerformed.filter(Boolean) : [],
    parts_used: toPartsPayload(record.partsUsed),
    materials_used: Array.isArray(record.materialsUsed) ? record.materialsUsed.filter(Boolean) : [],
    public_notes: record.publicNotes || '',
    internal_notes: record.internalNotes || '',
    performed_by: record.performedBy || 'AutoUP',
    verified_by_autoup: Boolean(record.verifiedByAutoup ?? true),
  };

  const { data, error } = await supabase.from('service_records').insert(payload).select().single();
  if (error) throw error;

  return normalizeServiceRecord(data);
}

export async function updateServiceRecord(recordId, updates) {
  const supabase = await requireAdminSession();

  const payload = {};
  if (updates.date !== undefined) payload.service_date = updates.date;
  if (updates.mileage !== undefined) {
    payload.mileage = updates.mileage === "" || updates.mileage === null ? null : Number(updates.mileage);
  }
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.customerComplaint !== undefined) payload.customer_complaint = updates.customerComplaint;
  if (updates.workPerformed !== undefined) payload.work_performed = updates.workPerformed.filter(Boolean);
  if (updates.partsUsed !== undefined) payload.parts_used = toPartsPayload(updates.partsUsed);
  if (updates.materialsUsed !== undefined) payload.materials_used = updates.materialsUsed.filter(Boolean);
  if (updates.publicNotes !== undefined) payload.public_notes = updates.publicNotes;
  if (updates.internalNotes !== undefined) payload.internal_notes = updates.internalNotes;
  if (updates.performedBy !== undefined) payload.performed_by = updates.performedBy;
  if (updates.verifiedByAutoup !== undefined) payload.verified_by_autoup = updates.verifiedByAutoup;

  const { data, error } = await supabase
    .from('service_records')
    .update(payload)
    .eq('id', recordId)
    .select()
    .single();

  if (error) throw error;
  return normalizeServiceRecord(data);
}

export async function deleteServiceRecord(recordId) {
  const supabase = await requireAdminSession();
  const { error } = await supabase.from('service_records').delete().eq('id', recordId);
  if (error) throw error;
  return true;
}

export default {
  normalizeVehicleIdentifier,
  normalizeVehicle,
  normalizeServiceRecord,
  findVehicleByRegistrationNumber,
  findAdminVehicleByRegistrationNumber,
  findVehicleByVin,
  findAdminVehicleByVin,
  getVehicleServiceRecords,
  getPublicVehicleServiceRecords,
  createVehicle,
  updateVehicle,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
};
