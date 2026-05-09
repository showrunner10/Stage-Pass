import { DashboardShell } from '@/components/layout/DashboardShell';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getCreatorAppSnapshot } from '@/lib/server/creator-app';

export default async function Earnings() {
  const snapshot = await getCreatorAppSnapshot();
  const stripeConnected = snapshot.payouts.some((payout) => Boolean(payout.transferId));

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Earnings</h1>
            <p className="text-offwhite/40 text-sm mt-1">
              Balances, ledger, and payouts. Stripe Connect Express is still required for live withdrawals.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="premium" disabled={!stripeConnected}>
              Withdraw
            </Button>
            <Link href="/app/profile">
              <Button variant="outline" className="text-white border-white/15 hover:bg-white/5">
                Payout settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-1">Stripe Connect</div>
            <p className="text-white font-semibold">{stripeConnected ? 'Connected' : 'Not connected'}</p>
            <p className="text-sm text-offwhite/45 mt-1">
              {stripeConnected
                ? 'Payout history is available below.'
                : 'Complete Express onboarding to enable payouts and tax forms.'}
            </p>
          </div>
          <Badge className={stripeConnected ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30 w-fit' : 'bg-amber-500/15 text-amber-200 border-amber-500/30 w-fit'}>
            {stripeConnected ? 'Connected' : 'Action required'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Available', value: snapshot.availableBalance, hint: 'Ready to withdraw', tone: 'text-accent-green' },
            { label: 'Pending', value: snapshot.pendingBalance, hint: 'In refund window', tone: 'text-white' },
            { label: 'Cleared', value: snapshot.clearedBalance, hint: 'Past clearance, not paid', tone: 'text-white' },
            { label: 'Paid (lifetime)', value: snapshot.paidLifetime, hint: 'Transferred total', tone: 'text-offwhite/80' },
          ].map((balance) => (
            <div key={balance.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="text-[10px] sm:text-xs font-bold text-offwhite/40 uppercase tracking-widest mb-2">{balance.label}</div>
              <div className={`text-2xl sm:text-3xl font-black ${balance.tone}`}>{formatCurrency(balance.value)}</div>
              <div className="text-[11px] text-offwhite/40 mt-2">{balance.hint}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-bold text-white mb-2">Auto-withdraw</h2>
          <p className="text-sm text-offwhite/45 mb-4">
            Weekly Sunday cycle is scoped. Threshold UI is in place; live automation depends on Stripe payout configuration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-1">
              <label className="text-xs text-offwhite/50 uppercase tracking-wider">Threshold (AUD)</label>
              <input
                type="number"
                defaultValue={50}
                className="mt-1 w-full max-w-xs h-11 rounded-xl bg-dark border border-white/10 px-3 text-white"
              />
            </div>
            <Button variant="outline" className="text-white border-white/15 h-11" disabled>
              Save preference
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-white mb-2">Commission ledger</h2>
          <p className="text-sm text-offwhite/40 mb-6">Order-level commission rows from the attribution ledger.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshot.ledger.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell className="text-white">{entry.description}</TableCell>
                  <TableCell className="text-offwhite/60">{entry.status}</TableCell>
                  <TableCell className={`text-right font-semibold ${entry.amount >= 0 ? 'text-accent-green' : 'text-offwhite/70'}`}>
                    {entry.amount >= 0 ? formatCurrency(entry.amount) : `-${formatCurrency(Math.abs(entry.amount))}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-white mb-2">Payout history</h2>
          <p className="text-sm text-offwhite/40 mb-4">Live transfer references will appear here after payout runs.</p>
          {snapshot.payouts.length === 0 ? (
            <div className="text-sm text-offwhite/50 rounded-xl border border-dashed border-white/10 p-8 text-center">
              No payouts yet - connect Stripe to enable withdrawals.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transfer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>{payout.createdAt}</TableCell>
                    <TableCell className="text-offwhite/60">{payout.status}</TableCell>
                    <TableCell className="text-white">{payout.transferId ?? 'Pending Stripe transfer'}</TableCell>
                    <TableCell className="text-right text-accent-green font-semibold">{formatCurrency(payout.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
