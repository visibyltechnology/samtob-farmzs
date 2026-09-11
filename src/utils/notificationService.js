import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Creates an in-app notification for a user in Firestore.
 * @param {string} userId - The uid of the user to notify.
 * @param {object} notification - { type, title, message, orderId }
 */
export const createNotification = async (userId, { type, title, message, orderId }) => {
  try {
    if (!userId) return;
    await addDoc(collection(db, 'users', userId, 'notifications'), {
      type,        // 'order_confirmed' | 'receipt_approved' | 'receipt_rejected' | 'out_for_delivery' | 'delivered'
      title,
      message,
      orderId: orderId || null,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};
