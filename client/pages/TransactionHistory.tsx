import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/ui/Navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  ExternalLink,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function TransactionHistory() {
  const { transactions, isConnected } = useWallet();
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    let filtered = transactions;

    // Filter by search term (game name or hash)
    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.hash.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((tx) => tx.type === filterType);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((tx) => tx.status === filterStatus);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterType, filterStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stake":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case "win":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "loss":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const openInExplorer = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, "_blank");
    toast.success("🔗 Opening in block explorer");
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("📋 Transaction hash copied!");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-neon-green">
          <CardContent className="p-6 text-center">
            <History className="w-16 h-16 text-neon-green mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400">
              Connect your wallet to view transaction history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="main-content p-4">
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-neon-green">
            📜 Transaction History
          </h1>
          <p className="text-gray-400">
            View all your game transactions and blockchain activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-neon-blue">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {transactions.length}
              </div>
              <div className="text-sm text-gray-400">Total Transactions</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {transactions.filter((tx) => tx.status === "confirmed").length}
              </div>
              <div className="text-sm text-gray-400">Confirmed</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-yellow-500">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {transactions.filter((tx) => tx.status === "pending").length}
              </div>
              <div className="text-sm text-gray-400">Pending</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-500">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {transactions.filter((tx) => tx.status === "failed").length}
              </div>
              <div className="text-sm text-gray-400">Failed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Game name or transaction hash"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="stake">Stakes</SelectItem>
                    <SelectItem value="win">Wins</SelectItem>
                    <SelectItem value="loss">Losses</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <History className="w-5 h-5" />
              Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No transactions found</p>
                <p className="text-sm text-gray-500">
                  {transactions.length === 0
                    ? "Start playing games to see your transaction history"
                    : "Try adjusting your filters"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(tx.type)}
                        {getStatusIcon(tx.status)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">
                            {tx.gameName}
                          </span>
                          <Badge
                            variant={
                              tx.type === "win"
                                ? "default"
                                : tx.type === "stake"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={
                              tx.type === "win"
                                ? "bg-green-600 text-white"
                                : tx.type === "stake"
                                  ? "bg-blue-600 text-white"
                                  : "bg-red-600 text-white"
                            }
                          >
                            {tx.type.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-400">
                          {tx.timestamp.toLocaleDateString()}{" "}
                          {tx.timestamp.toLocaleTimeString()}
                        </div>

                        <div className="text-xs text-gray-500 font-mono">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-lg font-semibold ${
                          tx.type === "win"
                            ? "text-green-400"
                            : tx.type === "stake"
                              ? "text-blue-400"
                              : "text-red-400"
                        }`}
                      >
                        {tx.type === "win" ? "+" : "-"}
                        {tx.amount.toFixed(6)} {tx.currency}
                      </div>

                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyHash(tx.hash)}
                          className="h-6 px-2 text-xs"
                        >
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openInExplorer(tx.hash)}
                          className="h-6 px-2 text-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Export History</h3>
                <p className="text-sm text-gray-400">
                  Download your transaction history for tax reporting
                </p>
              </div>
              <Button
                variant="outline"
                className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black"
                disabled
              >
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}