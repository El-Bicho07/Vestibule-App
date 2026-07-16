import React, { useMemo } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Chart } from "../components/Chart";
import { useStatsStore } from "../store/useStatsStore";
import { useBlocklistStore } from "../store/useBlocklistStore";
import { useSessionStore } from "../store/useSessionStore";
import { useThemeStore } from "../store/useThemeStore";
import { getColors, radius } from "../constants/theme";
import { buildWeeklyChart, generateInsights } from "../utils/insights";
import { formatDuration } from "../utils/time";
import { AppIcon } from "../components/AppIcon";

export const StatsScreen: React.FC = () => {
  const { theme } = useThemeStore();
  const c = getColors(theme);
  const { sessions, streak, longestStreak } = useStatsStore();
  const { apps } = useBlocklistStore();
  const { configureSession } = useSessionStore();

  const chartData = useMemo(() => buildWeeklyChart(sessions), [sessions]);
  const insights = useMemo(() => generateInsights(sessions), [sessions]);

  const completed = sessions.filter((s) => s.status === "complete").length;
  const abandoned = sessions.filter((s) => s.status === "abandoned").length;
  const totalMinutes = sessions
    .filter((s) => s.status === "complete")
    .reduce((acc, s) => acc + s.actualDuration / 60, 0);

  const mostBlocked = apps.filter((a) => a.blocked).slice().sort((a, b) => a.name.localeCompare(b.name))[0];

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
          Time Inside
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "300",
            color: c.text,
            letterSpacing: -0.6,
            lineHeight: 36,
            marginBottom: 24,
          }}
        >
          The record of your{"\n"}
          <Text style={{ color: c.subtext }}>quiet hours.</Text>
        </Text>

        {/* Weekly chart */}
        <Animatable.View animation="fadeInUp" duration={500}>
          <Card padding={20}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
              <Text style={{ fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: c.subtext, fontWeight: "600" }}>
                This week
              </Text>
              <Text style={{ fontSize: 12, color: c.subtext }}>minutes inside</Text>
            </View>
            <Chart data={chartData} testID="weekly-chart" />
          </Card>
        </Animatable.View>

        {/* Totals */}
        <View style={{ flexDirection: "row", marginTop: 16, gap: 12 }}>
          <StatTile label="Completed" value={String(completed)} c={c} />
          <StatTile label="Abandoned" value={String(abandoned)} c={c} />
        </View>
        <View style={{ flexDirection: "row", marginTop: 12, gap: 12 }}>
          <StatTile label="Longest streak" value={`${longestStreak}d`} c={c} />
          <StatTile label="Total" value={formatDuration(Math.round(totalMinutes))} c={c} />
        </View>

        {mostBlocked && (
          <View style={{ marginTop: 12 }}>
            <Card padding={16} testID="most-blocked-card">
              <Text style={{ fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: c.subtext, marginBottom: 10, fontWeight: "600" }}>
                Most common at the door
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AppIcon name={mostBlocked.name} icon={mostBlocked.icon} blocked size={36} />
                <Text style={{ fontSize: 18, color: c.text, fontWeight: "500", marginLeft: 12 }}>
                  {mostBlocked.name}
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Insights */}
        <Text
          style={{
            fontSize: 12,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: c.subtext,
            marginTop: 28,
            marginBottom: 14,
            fontWeight: "600",
          }}
        >
          Insights
        </Text>
        {insights.map((insight, i) => (
          <Animatable.View
            key={insight.id}
            animation="fadeInUp"
            duration={400}
            delay={i * 80}
            style={{ marginBottom: 12 }}
          >
            <Card padding={20} testID={`insight-${insight.id}`}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: c.text, marginBottom: 6, letterSpacing: -0.2 }}>
                {insight.insight}
              </Text>
              <Text style={{ fontSize: 13, color: c.subtext, marginBottom: 10, lineHeight: 19 }}>
                {insight.meaning}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: c.border,
                }}
              >
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: c.accent,
                    marginRight: 10,
                  }}
                />
                <Text style={{ fontSize: 13, color: c.text, flex: 1, fontWeight: "500" }}>
                  {insight.action}
                </Text>
              </View>
              {insight.hasCta && (
                <View style={{ marginTop: 14 }}>
                  <Button
                    testID={`insight-cta-${insight.id}`}
                    label="Start a morning session"
                    onPress={() => {
                      configureSession({ duration: 25 * 60, label: "Morning focus", strictMode: false });
                    }}
                    variant="secondary"
                  />
                </View>
              )}
            </Card>
          </Animatable.View>
        ))}

        <View style={{ height: 20 }} />
        <Text
          style={{
            fontSize: 12,
            color: c.subtext,
            textAlign: "center",
            letterSpacing: 0.5,
            marginTop: 10,
          }}
        >
          {sessions.length} sessions recorded · streak {streak}d
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatTile: React.FC<{ label: string; value: string; c: ReturnType<typeof getColors> }> = ({
  label,
  value,
  c,
}) => (
  <View
    style={{
      flex: 1,
      backgroundColor: c.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
    }}
  >
    <Text style={{ fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: c.subtext, marginBottom: 6, fontWeight: "600" }}>
      {label}
    </Text>
    <Text style={{ fontSize: 24, fontWeight: "300", color: c.text, fontFamily: "Courier", letterSpacing: -0.5 }}>
      {value}
    </Text>
  </View>
);
