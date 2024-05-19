import { angle, distance, normalizeAngle } from "src/lib/utils";
import PositionComponent from "../components/PositionComponent";
import CircleComponent from "../components/CircleComponent";
import { ComponentContainer } from "../Component";

type Radius = number;
type Angle = number;

export interface PolarPosition {
  distance: Radius; 
  angleFrom: Angle;
  angleTo: Angle;
  container: ComponentContainer;
}

export default class PolarMap {
  polarEntities: PolarPosition[] = [];

  constructor(center: ComponentContainer, entities: ComponentContainer[]) {
    this.calculatePolarEntities(center, entities);
  }

  public select(distanceTo: number, angleFrom: number, angleTo: number) {

    angleFrom = normalizeAngle(angleFrom);
    angleTo = normalizeAngle(angleTo);

    return this.polarEntities
      .filter((polarEntity) => {
        if (distanceTo <= polarEntity.distance) {
          return false
        }

        const a1 = 0;
        const a2 = normalizeAngle(polarEntity.angleTo - polarEntity.angleFrom);
        const b1 = normalizeAngle(angleFrom - polarEntity.angleFrom);
        const b2 = normalizeAngle(angleTo - polarEntity.angleFrom);

        return (
          a1 <= b1 && b1 <= a2 &&
          a1 <= b2 && b2 <= a2
        )
      })
      .sort((pe1, pe2) => pe2.distance - pe1.distance)
  }

  protected calculatePolarEntities(center: ComponentContainer, entities: ComponentContainer[]) {
    const centerPosition = center.get(PositionComponent);

    this.polarEntities = entities.map(container => {
      const pointCircle = container.get(CircleComponent);
      const pointPosition = container.get(PositionComponent);
      const a = angle(
        centerPosition.x,
        centerPosition.y,
        pointPosition.x,
        pointPosition.y,
      );

      const d = distance(
        centerPosition.x,
        centerPosition.y,
        pointPosition.x,
        pointPosition.y,
      );

      const ta = Math.asin(pointCircle.radius / (d)) * (180 / Math.PI);
  
      return {
        distance: d,
        angleFrom: normalizeAngle(a - ta),
        angleTo: normalizeAngle(a + ta),
        container
      }
    }).filter(polarEntity => !isNaN(polarEntity.angleFrom));
  }
}
