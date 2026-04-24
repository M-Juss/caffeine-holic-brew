
export async function loginUser(
  email: string,
  password: string,
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data.message || 'Request failed');
    (err as any).errors = data.errors ?? null;
    throw err;
  }

  localStorage.setItem("auth_token", `Bearer ${data.token}`);

  return data;


}


export async function createNewCustomer(
  username: string,
  email: string,
  password: string,
  password_confirmation: string,
  role: string
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password, password_confirmation, role})
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data.message || 'Request failed');
    (err as any).errors = data.errors ?? null;
    throw err;
  }

  return data;
}