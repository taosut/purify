import { Module, forwardRef, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schemas/project.schema';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { IssueSchema } from 'src/issues/schemas/issue.schema';
import { UnitSchema } from 'src/units/schemas/unit.schema';
import { ReportSchema } from 'src/reports/schemas/report.schema';
import { UnitsModule } from 'src/units/units.module';
import { UserSchema } from 'src/users/schemas/user.schema';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Project', schema: ProjectSchema },
      { name: 'Issue', schema: IssueSchema },
      { name: 'Unit', schema: UnitSchema },
      { name: 'Report', schema: ReportSchema },
      { name: 'User', schema: UserSchema },
    ]),
    CacheModule.register(),
    EventsModule,
    forwardRef(() => UnitsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
