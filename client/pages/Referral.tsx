import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/ui/Navigation";
import { Copy, Users, Coins, Share2, Gift } from "lucide-react";
import { toast } from "sonner";

interface ReferralUser {
  id: string;
  address: string;
  joinedAt: Date;
  totalStaked: number;
  commission: number;
}

export default function Referral() {
  const { address, isConnected } = useWallet();
  const [referralCode, setReferralCode] = useState("");
  const [referredUsers, setReferredUsers] = useState<ReferralUser[]>([]);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    if (address) {
      setReferralCode(address.slice(0, 8));
      // Load mock referred users
      const mockUsers: ReferralUser[] = [
        {
          id: "1",
          address: "0x1234...5678",
          joinedAt: new Date(Date.now() - 86400000 * 3),
          totalStaked: 0.5,
          commission: 0.025,
        },
        {
          id: "2",
          address: "0xabcd...efgh",
          joinedAt: new Date(Date.now() - 86400000 * 7),
          totalStaked: 1.2,
          commission: 0.06,
        },
        {
          id: "3",
          address: "0x9876...5432",
          joinedAt: new Date(Date.now() - 86400000 * 15),
          totalStaked: 2.1,
          commission: 0.105,
        },
      ];
      setReferredUsers(mockUsers);
      setTotalCommission(
        mockUsers.reduce((sum, user) => sum + user.commission, 0),
      );
    }
  }, [address]);

  const referralLink =
    address || referralCode
      ? `https://t.me/VaultRun_bot?start=${referralCode}`
      : "";

  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      toast.success("🔗 Referral link copied!");
    }
  };

  const shareReferralLink = () => {
    if (navigator.share && referralLink) {
      navigator.share({
        title: "VaultRun - Crypto Game Arcade",
        text: "Join me on VaultRun and play exciting crypto games!",
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-neon-green">
          <CardContent className="p-6 text-center">
            <Users className="w-16 h-16 text-neon-green mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-400">
              Connect your wallet to access the referral program and earn
              commissions.
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
              🎁 Referral Program
            </h1>
            <p className="text-gray-400">
              Invite friends and earn 5% commission on their stakes!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-900 border-neon-blue">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-neon-blue mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {referredUsers.length}
                </div>
                <div className="text-sm text-gray-400">Referred Users</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-neon-purple">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {totalCommission.toFixed(4)} ETH
                </div>
                <div className="text-sm text-gray-400">Total Commission</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-neon-green">
              <CardContent className="p-4 text-center">
                <Gift className="w-8 h-8 text-neon-green mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">5%</div>
                <div className="text-sm text-gray-400">Commission Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link */}
          <Card className="bg-gray-900 border-neon-green">
            <CardHeader>
              <CardTitle className="text-neon-green flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Your Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  size="icon"
                  className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={shareReferralLink}
                className="w-full bg-neon-green text-black hover:bg-neon-green/80"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Referral Link
              </Button>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">📚 How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neon-green text-black text-sm font-bold flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-white">Share Your Link</h3>
                  <p className="text-gray-400 text-sm">
                    Send your referral link to friends and family
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neon-blue text-black text-sm font-bold flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white">They Join & Play</h3>
                  <p className="text-gray-400 text-sm">
                    When they connect their wallet and start playing games
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neon-purple text-black text-sm font-bold flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-white">Earn Commission</h3>
                  <p className="text-gray-400 text-sm">
                    Get 5% of all their stakes automatically in your wallet
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referred Users */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">👥 Referred Users</CardTitle>
            </CardHeader>
            <CardContent>
              {referredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No referrals yet</p>
                  <p className="text-sm text-gray-500">
                    Share your link to start earning!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {referredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="font-mono text-white">
                          {user.address}
                        </div>
                        <div className="text-sm text-gray-400">
                          Joined {user.joinedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {user.totalStaked.toFixed(4)} ETH
                        </div>
                        <div className="text-sm text-neon-green">
                          +{user.commission.toFixed(4)} ETH
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
