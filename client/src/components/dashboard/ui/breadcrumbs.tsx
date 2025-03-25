import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/src/hooks/use-breadcrumbs";
import { Slash } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router";

export function Breadcrumbs() {
  const items = useBreadcrumbs();

  if (items.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/*  @ts-expect-error: no prob */}
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <Link to={item.link}>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>{item.title}</BreadcrumbLink>
                </BreadcrumbItem>
              </Link>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block">
                <Slash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
