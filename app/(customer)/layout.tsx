import { getCustomerData } from '@/app/actions/customer';
import { CustomerShell } from '@/components/customer/customer-shell';

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getCustomerData();

  return <CustomerShell user={profile}>{children}</CustomerShell>;
}
