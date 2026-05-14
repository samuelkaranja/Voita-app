import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ProfileImagePicker from "./ProfileImagePicker";
import CustomInput from "./CustomInput";

export default function UserDetailsTab () {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  return (
    <View style={styles.container}>
      <ProfileImagePicker />
      
      <Text style={styles.label}>First Name</Text>
      <CustomInput
        placeholder="Jane"
        value={form.firstName}
        onChangeText={(text: string) =>
          setForm({ ...form, firstName: text })
        }
      />
     
      <Text style={styles.label}>Last Name</Text>
      <CustomInput
        placeholder="Doe"
        value={form.lastName}
        onChangeText={(text: string) =>
          setForm({ ...form, lastName: text })
        }
      />
 
      <Text style={styles.label}>Phone Number</Text>
      <CustomInput
        placeholder="07xxxxxxxx"
        value={form.phone}
        onChangeText={(text: string) =>
          setForm({ ...form, phone: text })
        }
      />

      <Text style={styles.label}>Email Address</Text>
      <CustomInput
        placeholder="janedoe@gmail.com"
        value={form.email}
        onChangeText={(text: string) =>
          setForm({ ...form, email: text })
        }
      />

      <TouchableOpacity style={styles.save}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 7,
  },
  save: {
  marginTop: 30,
    marginBottom: 30,
    backgroundColor: '#006c52',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveText: {
  color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
