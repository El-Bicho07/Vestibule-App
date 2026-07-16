import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
} from "react-native";
import * as Animatable from "react-native-animatable";
import * as Haptics from "expo-haptics";
import { Search, X } from "lucide-react-native";
import { useBlocklistStore } from "../store/useBlocklistStore";
import { useSessionStore } from "../store/useSessionStore";
import { useThemeStore } from "../store/useThemeStore";
import { getColors, radius } from "../constants/theme";
import { AppIcon } from "../components/AppIcon";
import { PlatformBlockingCard } from "../components/PlatformBlockingCard";

type Filter = "all" | "blocked";

export const BlocklistScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const c = getColors(theme);
  const { apps, toggleApp } = useBlocklistStore();
  const { isActive } = useSessionStore();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      const matchQ = !q || a.name.toLowerCase().includes(q);
      const matchF = filter === "all" || a.blocked;
      return matchQ && matchF;
    });
  }, [apps, query, filter]);

  const blockedCount = apps.filter((a) => a.blocked).length;

  const handleToggle = (id: string) => {
    Haptics.selectionAsync();
    toggleApp(id);
    if (isActive) {
      setToast("Changes apply to your next session");
      setTimeout(() => setToast(null), 2800);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: c.subtext,
            marginBottom: 12,
            fontWeight: "600",
          }}
        >
          At the Door
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "300",
            color: c.text,
            letterSpacing: -0.6,
            lineHeight: 36,
            marginBottom: 8,
          }}
        >
          Decide who waits outside
        </Text>
        <Text style={{ color: c.subtext, fontSize: 15, marginBottom: 24 }}>
          {blockedCount} of {apps.length} apps blocked at the door
        </Text>

        {/* Platform blocking upgrade */}
        <PlatformBlockingCard />

        {/* Search */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: radius.md,
            paddingHorizontal: 14,
            backgroundColor: c.surface,
            marginBottom: 14,
          }}
        >
          <Search size={16} color={c.subtext} strokeWidth={1.6} />
          <TextInput
            testID="blocklist-search"
            value={query}
            onChangeText={setQuery}
            placeholder="Search apps"
            placeholderTextColor={c.subtext}
            style={{
              flex: 1,
              paddingVertical: 14,
              paddingHorizontal: 10,
              fontSize: 15,
              color: c.text,
            }}
          />
          {query.length > 0 && (
            <Pressable testID="clear-search" onPress={() => setQuery("")} hitSlop={8}>
              <X size={16} color={c.subtext} strokeWidth={1.6} />
            </Pressable>
          )}
        </View>

        {/* Filter chips */}
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          {(["all", "blocked"] as Filter[]).map((f) => (
            <Pressable
              key={f}
              testID={`filter-${f}`}
              onPress={() => {
                Haptics.selectionAsync();
                setFilter(f);
              }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: filter === f ? c.text : c.border,
                backgroundColor: filter === f ? c.text : "transparent",
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: filter === f ? c.background : c.text,
                }}
              >
                {f === "all" ? "All" : "Blocked only"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* List */}
        <View>
          {filtered.map((app, idx) => (
            <Animatable.View
              key={app.id}
              animation="fadeInUp"
              duration={250}
              delay={idx * 18}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: 16,
                backgroundColor: c.surface,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: c.border,
                marginBottom: 8,
              }}
            >
              <View style={{ marginRight: 14 }}>
                <AppIcon name={app.name} icon={app.icon} blocked={app.blocked} size={40} testID={`icon-${app.id}`} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "500", color: c.text }}>{app.name}</Text>
                <Text style={{ fontSize: 12, color: c.subtext, marginTop: 2 }}>
                  {app.blocked ? "Waits outside" : "Allowed inside"}
                </Text>
              </View>
              <Switch
                testID={`toggle-${app.id}`}
                value={app.blocked}
                onValueChange={() => handleToggle(app.id)}
                trackColor={{ false: c.border, true: c.accent }}
                thumbColor={c.surface}
              />
            </Animatable.View>
          ))}
          {filtered.length === 0 && (
            <Text style={{ color: c.subtext, textAlign: "center", paddingVertical: 40 }}>
              Nothing matches that search.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Toast */}
      {toast && (
        <Animatable.View
          animation="fadeInUp"
          duration={250}
          style={{
            position: "absolute",
            bottom: 24,
            alignSelf: "center",
            backgroundColor: c.primary,
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: radius.full,
          }}
        >
          <Text style={{ color: c.background, fontSize: 13, fontWeight: "500" }}>{toast}</Text>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};
