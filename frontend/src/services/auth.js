import { api } from './api';
import { auth, googleProvider, signInWithPopup } from '../firebase';

export const authService = {
    /**
     * Registers a new user with email and password.
     * @param {Object} data - { email, password, role }
     * @returns {Promise} - Response from the server
     */
    async registerWithEmail(data) {
        try {
            // Map frontend data to backend schema
            const payload = {
                user_type: data.role,
                first_name: data.username, // Mapping username to first_name
                email: data.email,
                password: data.password,
                phone_number: data.phoneNumber,
                grade: data.grade, // For students
                // Optional: last_name can be handled if added to form
            };

            const response = await api.register(payload);
            return response.data;
        } catch (error) {
            // Rethrow the error to be handled by the component
            throw error;
        }
    },

    async loginWithEmail(email, password) {
        try {
            const response = await api.login(email, password);
            // Store the token (api.login does this, but good to be explicit or if we need side effects)
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Initiates Google OAuth flow.
     * This is where you would integrate with @react-oauth/google or similar.
     */
    /**
     * Initiates Google OAuth flow.
     */
    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Send user details to backend
            const payload = {
                email: user.email,
                first_name: user.displayName ? user.displayName.split(' ')[0] : 'User',
                last_name: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
                google_id: user.uid,
                photo_url: user.photoURL
            };

            const response = await api.googleLogin(payload);
            return response;
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    }
};
