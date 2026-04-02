import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PROFILE_KEY = 'gridlock_profile_data';

const defaultProfile = {
    username: 'ben_is_jammin',
    firstName: 'Ben',
    lastName: 'Jammin',
    email: 'benjammin@gmail.com',
    dob: '03/04/1990',
    };

export default function ProfileScreen() {
    const [profile, setProfile] = useState(defaultProfile);
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
        const savedProfile = await AsyncStorage.getItem(PROFILE_KEY);
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }
        } catch (error) {
        console.log('Error loading profile:', error);
        }
    };

    const saveProfileToStorage = async (updatedProfile) => {
        try {
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
        } catch (error) {
        console.log('Error saving profile:', error);
        }
    };

    const startEditing = (fieldKey, currentValue) => {
        setEditingField(fieldKey);
        setTempValue(currentValue);
        setModalVisible(true);
    };

    const saveEdit = async () => {
        if (!editingField) return;

        const updatedProfile = {
        ...profile,
        [editingField]: tempValue,
        };

        setProfile(updatedProfile);
        await saveProfileToStorage(updatedProfile);

        setModalVisible(false);
        setEditingField(null);
        setTempValue('');
    };

    const cancelEdit = () => {
        setModalVisible(false);
        setEditingField(null);
        setTempValue('');
    };

    const renderEditableField = (label, value, fieldKey, leftIcon) => (
        <TouchableOpacity
        style={styles.fieldBlock}
        onPress={() => startEditing(fieldKey, value)}
        activeOpacity={0.8}
        >
        <Text style={styles.fieldLabel}>{label}</Text>

        <View style={styles.inputCard}>
            <View style={styles.inputLeft}>
            <Ionicons
                name={leftIcon}
                size={18}
                color="#8E8E8E"
                style={styles.leftIcon}
            />
            <Text style={styles.inputValue}>{value}</Text>
            </View>

            <Ionicons name="create-outline" size={20} color="#8E63B7" />
        </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#8E63B7" />
        </TouchableOpacity>

        <Image
            source={require('../../assets/images/GridLock.png')}
            style={styles.logo}
            resizeMode="contain"
        />

        <Text style={styles.title}>Personal Information</Text>

        <View style={styles.profileImageWrap}>
            <Image
            source={require('../../assets/images/userpic.png')}
            style={styles.profileImage}
            />
            <TouchableOpacity style={styles.profileEditIcon}>
            <Ionicons name="create" size={16} color="#8E63B7" />
            </TouchableOpacity>
        </View>

        {renderEditableField('Username', profile.username, 'username', 'person-outline')}
        {renderEditableField('First name', profile.firstName, 'firstName', 'person-outline')}
        {renderEditableField('Last name', profile.lastName, 'lastName', 'person-outline')}
        {renderEditableField('Email address', profile.email, 'email', 'mail-outline')}
        {renderEditableField('Date of birth', profile.dob, 'dob', 'calendar-outline')}

        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={cancelEdit}
        >
            <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Edit Information</Text>

                <TextInput
                value={tempValue}
                onChangeText={setTempValue}
                style={styles.modalInput}
                placeholder="Type here"
                placeholderTextColor="#AAA"
                />

                <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 16,
        paddingTop: 28,
    },
    backButtonTop: {
        position: 'absolute',
        top: 162,
        left: 14,
        zIndex: 10,
    },
    logo: {
        width: 95,
        height: 95,
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 4,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        color: '#5A1FA6',
        fontWeight: '600',
        marginBottom: 14,
    },
    profileImageWrap: {
        alignSelf: 'center',
        marginBottom: 10,
        position: 'relative',
    },
    profileImage: {
        width: 86,
        height: 86,
        borderRadius: 43,
    },
    profileEditIcon: {
        position: 'absolute',
        right: -2,
        top: 2,
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        padding: 2,
    },
    fieldBlock: {
        marginBottom: 14,
    },
    fieldLabel: {
        fontSize: 16,
        color: '#6A1FB2',
        marginBottom: 8,
    },
    inputCard: {
        backgroundColor: '#F3F3F3',
        borderWidth: 1,
        borderColor: '#E1E1E1',
        borderRadius: 14,
        minHeight: 54,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    leftIcon: {
        marginRight: 10,
    },
    inputValue: {
        fontSize: 15,
        color: '#5A1FA6',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.28)',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    modalBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#5A1FA6',
        marginBottom: 12,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#D6C7F2',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: '#4B2E83',
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelBtn: {
        flex: 1,
        marginRight: 8,
        backgroundColor: '#EFE8FB',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    saveBtn: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: '#8D63FF',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#6A1FB2',
        fontWeight: '700',
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
});