import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import * as Contacts from 'expo-contacts';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('permission denied');
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      setContacts(data);
    }
  };

  const contactClick = (contact) => {
    setSelectedContact(contact);
  };

  const modalClose = () => {
    setSelectedContact(null);
  };

  const search = (text) => {
    setSearchText(text);
  };

  const contactsFilter = contacts.filter((contact) =>
    contact.name && contact.name.toUpperCase().includes(searchText.toUpperCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputText}
        placeholder="Search"
        onChangeText={search}
      />
      <FlatList
        data={contactsFilter}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => contactClick(item)}
          >
            <Text style={styles.contactName}>{item.name}</Text>
            {item.phoneNumbers && item.phoneNumbers.length > 0 && (
              <Text style={styles.contactNumber}>{item.phoneNumbers[0].number}</Text>
            )}
          </TouchableOpacity>
        )}
      />
      <Modal
        visible={selectedContact !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={modalClose}
      >
        <TouchableWithoutFeedback onPress={modalClose}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedContact?.name}</Text>
              {selectedContact?.phoneNumbers && selectedContact?.phoneNumbers.length > 0 && (
                <Text style={styles.modalText}>{selectedContact?.phoneNumbers[0].number}</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={modalClose}
              >
                <Text style={styles.buttonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop:45,
  },
  inputText: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contactItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
    marginBottom: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
