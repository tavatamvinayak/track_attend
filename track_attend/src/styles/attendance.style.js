import { StyleSheet } from "react-native";

const AttendanceStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  statusCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  statusText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: "#888",
    
    marginBottom: 3,
  },
  hoursText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2196F3",
    marginTop: 5,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 200,
    alignItems: "center",
  },
  checkInButton: {
    backgroundColor: "#4CAF50",
  },
  checkOutButton: {
    backgroundColor: "#FF5722",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  completedText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
    textAlign: "center",
  },
  locationInfo: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  accuracyText: {
    fontSize: 12,
    color: "#888",
  },
});
export { AttendanceStyles };

