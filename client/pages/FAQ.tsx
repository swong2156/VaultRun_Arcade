import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/Navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HelpCircle,
  ChevronDown,
  Wallet,
  Gamepad2,
  DollarSign,
  Shield,
  Users,
  ExternalLink,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "wallet" | "games" | "rewards" | "security" | "support";
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "general",
    question: "What is VaultRun?",
    answer:
      "VaultRun is a Telegram-based crypto gaming arcade featuring 30 unique games where you can stake real cryptocurrency and win rewards. It's designed for fast-paced, exciting gameplay with real money transactions using WalletConnect technology.",
  },
  {
    id: "2",
    category: "wallet",
    question: "How does wallet connection work?",
    answer:
      "VaultRun uses WalletConnect v2 to securely connect your crypto wallet. We support major wallets including MetaMask, TrustWallet, Coinbase Wallet, and more. Your private keys never leave your wallet, ensuring maximum security.",
  },
  {
    id: "3",
    category: "wallet",
    question: "Which cryptocurrencies are supported?",
    answer:
      "We currently support ETH, USDT, BTC, MATIC, BNB, and DOGE. You can switch between currencies in the top-right currency selector, and all balances update in real-time.",
  },
  {
    id: "4",
    category: "games",
    question: "How do the games work?",
    answer:
      "Each game has its own unique mechanics and win conditions. You choose your stake amount, play the game, and either win (receiving your stake plus profit) or lose (forfeit your stake). Games are designed to be quick (5-15 seconds) and exciting.",
  },
  {
    id: "5",
    category: "games",
    question: "Are the game outcomes fair?",
    answer:
      "Yes! All games use provably fair algorithms. Game outcomes are determined by secure random number generation, and you can verify the fairness of each result. We don't manipulate outcomes in favor of the house.",
  },
  {
    id: "6",
    category: "rewards",
    question: "Are winnings real cryptocurrency?",
    answer:
      "Absolutely! All stakes and winnings are real cryptocurrency transactions. When you win, the cryptocurrency is automatically sent to your connected wallet. When you lose, your stake is deducted from your wallet balance.",
  },
  {
    id: "7",
    category: "rewards",
    question: "How does the referral program work?",
    answer:
      "Share your unique referral link with friends. When they connect their wallet and start playing, you earn 5% commission on all their stakes automatically sent to your wallet. There's no limit to how much you can earn through referrals.",
  },
  {
    id: "8",
    category: "security",
    question: "Is VaultRun safe to use?",
    answer:
      "Yes! We prioritize security above all else. We never store your private keys or seed phrases. All transactions are initiated and signed directly from your wallet. We use industry-standard security practices and WalletConnect's secure protocol.",
  },
  {
    id: "9",
    category: "security",
    question: "What about gas fees?",
    answer:
      "Gas fees are required for blockchain transactions and are paid separately from your game stakes. The exact fee depends on network congestion and which blockchain you're using. We recommend using Polygon (MATIC) for lower fees.",
  },
  {
    id: "10",
    category: "wallet",
    question: "What happens if my transaction fails?",
    answer:
      "If a transaction fails or is rejected, no changes are made to your wallet balance. You'll see a user-friendly notification explaining what happened. Failed transactions don't affect your game or balance.",
  },
  {
    id: "11",
    category: "games",
    question: "Can I play without connecting a wallet?",
    answer:
      "Yes! You can try all games with mock balances when no wallet is connected. This lets you learn how each game works before playing with real cryptocurrency. However, winnings in demo mode aren't real.",
  },
  {
    id: "12",
    category: "support",
    question: "What if I encounter a problem?",
    answer:
      "If you experience any issues, you can contact our support team through Telegram or check your transaction history in the app. Most issues are related to network connectivity or wallet configuration.",
  },
  {
    id: "13",
    category: "games",
    question: "Are there betting limits?",
    answer:
      "You can stake any amount up to your available wallet balance. However, we recommend starting with small amounts to get familiar with each game. Some games may have minimum stake requirements for optimal gameplay.",
  },
  {
    id: "14",
    category: "general",
    question: "Is VaultRun available on mobile?",
    answer:
      "Yes! VaultRun is fully optimized for mobile devices and works great as a Telegram Mini App. You can also access it through any mobile web browser. The interface adapts perfectly to all screen sizes.",
  },
  {
    id: "15",
    category: "security",
    question: "How do I stay safe while playing?",
    answer:
      "Only connect wallets you control, never share your seed phrase, double-check transaction details before confirming, start with small amounts, and only use official VaultRun links. Be cautious of phishing attempts.",
  },
];

const categories = [
  { id: "general", name: "General", icon: HelpCircle },
  { id: "wallet", name: "Wallet & Crypto", icon: Wallet },
  { id: "games", name: "Games", icon: Gamepad2 },
  { id: "rewards", name: "Rewards & Earnings", icon: DollarSign },
  { id: "security", name: "Security", icon: Shield },
  { id: "support", name: "Support", icon: Users },
] as const;

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQs = faqData.filter(
    (faq) => faq.category === selectedCategory,
  );

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="main-content p-4">
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-neon-green">
            📚 Frequently Asked Questions
          </h1>
          <p className="text-gray-400">
            Everything you need to know about VaultRun
          </p>
        </div>

        {/* Category Selection */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "ghost"
                    }
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex flex-col gap-2 h-auto p-3 ${
                      selectedCategory === category.id
                        ? "bg-neon-green text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs">{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Items */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {categories.find((cat) => cat.id === selectedCategory)?.name}{" "}
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredFAQs.map((faq) => (
              <Collapsible
                key={faq.id}
                open={openItems.includes(faq.id)}
                onOpenChange={() => toggleItem(faq.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-left h-auto p-4 bg-gray-800 hover:bg-gray-750 text-white"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openItems.includes(faq.id) ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="text-gray-300 leading-relaxed pt-2">
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-neon-blue">
            <CardContent className="p-6 text-center">
              <Wallet className="w-12 h-12 text-neon-blue mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">
                Need Help Connecting?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Check out our wallet connection guide
              </p>
              <Button
                variant="outline"
                className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black"
                disabled
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Guide Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-neon-purple">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-neon-purple mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">
                Still Need Help?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Join our community for support
              </p>
              <Button
                variant="outline"
                className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black"
                disabled
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Support Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="bg-yellow-900/20 border-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-yellow-500 mt-1" />
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2">
                  🔒 Security Reminder
                </h3>
                <p className="text-yellow-200 text-sm">
                  Always verify you're on the official VaultRun website before
                  connecting your wallet. We will never ask for your private
                  keys or seed phrase. Be cautious of phishing attempts and only
                  use official links.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center">
            <h3 className="text-white font-semibold mb-2">
              Didn't find what you're looking for?
            </h3>
            <p className="text-gray-400 text-sm">
              More help resources and contact options coming soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}