import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from "@/libs/patternfly/react-core";
import { SearchIcon } from "@/libs/patternfly/react-icons";
import { useTranslations } from "next-intl";

export function NoResultsEmptyState({ onReset }: { onReset: () => void }) {
  const t = useTranslations("message-browser");
  return (
    <EmptyState variant={"lg"}>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel="h4" size="lg">
        {t("no_results_title")}
      </Title>
      <EmptyStateBody>{t("no_results_body")}</EmptyStateBody>
      <Button variant={"link"} onClick={onReset}>
        {t("no_results_reset")}
      </Button>
    </EmptyState>
  );
}
