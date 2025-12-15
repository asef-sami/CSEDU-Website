export const rooms = [
  {
    id: 1,
    name: "Room 301",
    type: "Classroom",
    capacity: 60,
    facilities: ["Projector", "Whiteboard", "Air Conditioning", "Sound System"],
    availability: {
      "2023-07-10": ["8:00-10:00", "14:00-16:00"],
      "2023-07-11": ["10:00-12:00", "16:00-18:00"],
      "2023-07-12": ["8:00-10:00", "12:00-14:00"],
    },
  },
  {
    id: 2,
    name: "Lab 1",
    type: "Computer Lab",
    capacity: 40,
    facilities: ["40 Computers", "Projector", "Air Conditioning", "Network Access"],
    availability: {
      "2023-07-10": ["10:00-12:00", "16:00-18:00"],
      "2023-07-11": ["8:00-10:00", "14:00-16:00"],
      "2023-07-12": ["10:00-12:00", "16:00-18:00"],
    },
  },
  {
    id: 3,
    name: "Seminar Hall",
    type: "Seminar Hall",
    capacity: 100,
    facilities: ["Projector", "Sound System", "Air Conditioning", "Stage", "Microphones"],
    availability: {
      "2023-07-10": ["14:00-16:00"],
      "2023-07-11": ["10:00-12:00"],
      "2023-07-12": ["14:00-16:00", "16:00-18:00"],
    },
  },
  {
    id: 4,
    name: "Conference Room",
    type: "Meeting Room",
    capacity: 20,
    facilities: ["Projector", "Whiteboard", "Air Conditioning", "Video Conferencing"],
    availability: {
      "2023-07-10": ["8:00-10:00", "12:00-14:00", "16:00-18:00"],
      "2023-07-11": ["8:00-10:00", "12:00-14:00"],
      "2023-07-12": ["8:00-10:00", "10:00-12:00", "14:00-16:00"],
    },
  },
]

export const equipment = [
  {
    id: 1,
    name: "NVIDIA RTX 4090 GPU",
    type: "GPU",
    quantity: 5,
    location: "AI Lab",
    specifications: "24GB GDDR6X, CUDA Cores: 16384",
    availability: {
      "2023-07-10": ["8:00-12:00", "14:00-18:00"],
      "2023-07-11": ["10:00-14:00", "16:00-20:00"],
      "2023-07-12": ["8:00-12:00", "14:00-18:00"],
    },
  },
  {
    id: 2,
    name: "Arduino Uno Kit",
    type: "Microcontroller",
    quantity: 20,
    location: "IoT Lab",
    specifications: "ATmega328P, 14 Digital I/O pins, 6 Analog inputs",
    availability: {
      "2023-07-10": ["8:00-18:00"],
      "2023-07-11": ["8:00-18:00"],
      "2023-07-12": ["8:00-18:00"],
    },
  },
  {
    id: 3,
    name: "Raspberry Pi 4",
    type: "Single Board Computer",
    quantity: 15,
    location: "IoT Lab",
    specifications: "4GB RAM, Quad-core ARM Cortex-A72, Wi-Fi, Bluetooth",
    availability: {
      "2023-07-10": ["8:00-18:00"],
      "2023-07-11": ["8:00-18:00"],
      "2023-07-12": ["8:00-18:00"],
    },
  },
  {
    id: 4,
    name: "Oscilloscope",
    type: "Measurement Device",
    quantity: 3,
    location: "Electronics Lab",
    specifications: "100 MHz, 4 Channels, Digital Storage",
    availability: {
      "2023-07-10": ["8:00-12:00", "14:00-18:00"],
      "2023-07-11": ["10:00-14:00"],
      "2023-07-12": ["8:00-12:00", "16:00-18:00"],
    },
  },
  {
    id: 5,
    name: "3D Printer",
    type: "Manufacturing",
    quantity: 2,
    location: "Maker Space",
    specifications: "FDM, Build Volume: 220×220×250mm, PLA/ABS Compatible",
    availability: {
      "2023-07-10": ["8:00-18:00"],
      "2023-07-11": ["8:00-18:00"],
      "2023-07-12": ["8:00-18:00"],
    },
  },
]
