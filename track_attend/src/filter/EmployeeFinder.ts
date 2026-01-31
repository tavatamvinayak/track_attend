function EmployeeFind(id: any, Employees: any) {
  if (!id || !Employees) return null;
  return Employees.find((e: any) => e._id === id);
}
export default EmployeeFind;
